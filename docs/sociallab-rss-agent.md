# SocialLab RSS Agent

Last updated: 2026-07-07

## What this does

This agent reads the SocialLab public RSS feed and writes normalized feed items into a PostgreSQL-compatible cloud database.

It is designed to be run:
- locally for testing
- on a schedule in GitHub Actions
- from any other runner that can access the database

## Default feed source

- `https://sociallab.ai/feed/`

## Database target

This agent works with either:
- **Supabase REST API** via `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` *(recommended for your setup)*
- **Direct PostgreSQL** via `DATABASE_URL`

It works with:
- Supabase
- Neon
- Railway Postgres
- Render Postgres
- any other PostgreSQL-compatible cloud DB

## Files

| File | Purpose |
|---|---|
| `scripts/sociallab-rss-agent.mjs` | Main ingestion agent |
| `scripts/sociallab-rss-schema.sql` | Table schema for the cloud database |

## Environment variables

| Variable | Required | Description |
|---|---:|---|
| `RSS_URL` | optional | Single RSS feed URL |
| `RSS_URLS` | optional | Comma-separated list of feed URLs |
| `SUPABASE_URL` | required for Supabase mode | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | required for Supabase mode | Supabase service role key |
| `DATABASE_URL` | required for Postgres mode | PostgreSQL connection string |
| `TABLE_NAME` | optional | Target table name, default `sociallab_rss_items` |
| `MAX_ITEMS` | optional | Limit items processed per feed, default `100` |
| `DRY_RUN` | optional | Set to `1`/`true` to parse feeds without writing to DB |
| `USER_AGENT` | optional | Custom request user-agent |
| `PGSSLMODE` | optional | Set to `disable` for local DB without TLS |

## Quick start

### 1) Create the table

Run the SQL file in your cloud database:

```sql
-- scripts/sociallab-rss-schema.sql
```

### 2) Run a dry run

```bash
DRY_RUN=1 node scripts/sociallab-rss-agent.mjs
```

### 3) Sync to the cloud DB

```bash
SUPABASE_URL='https://your-project-ref.supabase.co' \
SUPABASE_SERVICE_ROLE_KEY='your-service-role-key' \
node scripts/sociallab-rss-agent.mjs
```

If you prefer direct Postgres:

```bash
DATABASE_URL='postgresql://...' node scripts/sociallab-rss-agent.mjs
```

## What gets stored

Each feed item is normalized into:
- source ID / GUID
- feed URL
- source domain
- title
- link
- author
- categories
- summary
- content HTML
- content text
- published date
- checksum
- raw JSON payload
- first seen / last seen timestamps
- seen count

## Behavior

- Existing rows are updated only when the item checksum changes.
- New items are inserted.
- Unchanged items are skipped.
- The script prints a JSON summary at the end.

## Suggested GitHub Actions usage

Use the workflow in `.github/workflows/sociallab-rss-sync.yml` and store `DATABASE_URL` as a secret.
