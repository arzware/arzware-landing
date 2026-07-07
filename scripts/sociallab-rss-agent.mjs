import crypto from 'node:crypto';
import { XMLParser } from 'fast-xml-parser';
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_FEEDS = ['https://sociallab.ai/feed/'];
const TABLE_NAME = process.env.TABLE_NAME?.trim() || 'sociallab_rss_items';
const RSS_URLS = (process.env.RSS_URLS || process.env.RSS_URL || DEFAULT_FEEDS.join(','))
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const DRY_RUN = isTruthy(process.env.DRY_RUN || process.env.SOCIALLAB_RSS_DRY_RUN);
const MAX_ITEMS = Number(process.env.MAX_ITEMS || 100);
const USER_AGENT =
  process.env.USER_AGENT ||
  'Mozilla/5.0 (compatible; SocialLabRssAgent/1.0; +https://sociallab.ai/)';

validateIdentifier(TABLE_NAME);

if (!RSS_URLS.length) {
  throw new Error('No RSS feed URL configured. Set RSS_URL or RSS_URLS.');
}

const XML = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: false,
  processEntities: true,
  trimValues: true,
  cdataPropName: '__cdata',
});

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
const supabaseUrl = process.env.SUPABASE_URL?.trim() || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';
const hasSupabaseUrl = Boolean(supabaseUrl);
const hasSupabaseServiceKey = Boolean(supabaseServiceRoleKey);

const pool = DRY_RUN || !hasDatabaseUrl ? null : new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: buildSslConfig(process.env.DATABASE_URL),
  max: Number(process.env.PGPOOL_MAX || 3),
});

const supabase =
  DRY_RUN || hasDatabaseUrl || !hasSupabaseUrl || !hasSupabaseServiceKey
    ? null
    : createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value ?? '').trim().toLowerCase());
}

function validateIdentifier(value) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
    throw new Error(`Invalid TABLE_NAME: ${value}. Use only letters, numbers, and underscores.`);
  }
}

function buildSslConfig(connectionString) {
  if (!connectionString) return undefined;
  try {
    const url = new URL(connectionString);
    const sslMode = (url.searchParams.get('sslmode') || process.env.PGSSLMODE || '').toLowerCase();
    if (sslMode === 'disable') return false;
    if (['localhost', '127.0.0.1', '::1'].includes(url.hostname)) return false;
    return { rejectUnauthorized: false };
  } catch {
    return { rejectUnauthorized: false };
  }
}

function arrayify(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function firstText(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return firstText(value[0]);
  if (typeof value === 'object') {
    if (typeof value['#text'] === 'string') return value['#text'];
    if (typeof value.__cdata === 'string') return value.__cdata;
    if (typeof value.value === 'string') return value.value;
  }
  return '';
}

function stripHtml(input) {
  return String(input || '')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*\/p\s*>/gi, '\n')
    .replace(/<\s*p[^>]*>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function checksumFor(row) {
  return crypto
    .createHash('sha256')
    .update(
      [
        row.source_id,
        row.title,
        row.link,
        row.published_at || '',
        row.summary || '',
        row.content_text || '',
      ].join('\u241f')
    )
    .digest('hex');
}

function pickLink(item) {
  const atomLink = item?.link;
  if (typeof atomLink === 'string') return atomLink;
  if (Array.isArray(atomLink)) {
    const first = atomLink[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object') return first['@_href'] || first.href || first['#text'] || '';
  }
  if (atomLink && typeof atomLink === 'object') {
    return atomLink['@_href'] || atomLink.href || atomLink['#text'] || '';
  }
  return firstText(item?.link);
}

function pickGuid(item, fallbackLink, title, publishedAt) {
  const rawGuid = firstText(item?.guid).trim();
  if (rawGuid) return rawGuid;
  if (fallbackLink) return fallbackLink;
  return crypto.createHash('sha1').update([title, publishedAt || ''].join('\u241f')).digest('hex');
}

function parseDate(value) {
  const text = firstText(value).trim();
  if (!text) return null;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function extractCategories(item) {
  return arrayify(item?.category)
    .map((category) => firstText(category).trim())
    .filter(Boolean);
}

function makeRow(feedUrl, item) {
  const title = firstText(item?.title).trim();
  const link = pickLink(item).trim();
  const publishedAt = parseDate(item?.pubDate || item?.published || item?.updated || item?.['dc:date']);
  const guid = pickGuid(item, link, title, publishedAt);
  const categories = extractCategories(item);
  const author = firstText(item?.author || item?.['dc:creator']).trim();
  const summary = stripHtml(firstText(item?.description || item?.summary || item?.content || ''));
  const contentHtml = firstText(item?.['content:encoded'] || item?.content || item?.summary || item?.description || '');
  const contentText = stripHtml(contentHtml || summary);
  const sourceDomain = new URL(feedUrl).hostname;

  const row = {
    source_id: guid,
    feed_url: feedUrl,
    source_domain: sourceDomain,
    title: title || '(untitled)',
    link: link || feedUrl,
    guid,
    author: author || null,
    categories,
    summary: summary || null,
    content_html: contentHtml || null,
    content_text: contentText || null,
    published_at: publishedAt,
    checksum: '',
    raw_item: item,
  };

  row.checksum = checksumFor(row);
  return row;
}

async function fetchFeed(feedUrl) {
  const response = await fetch(feedUrl, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5',
    },
  });

  if (!response.ok) {
    throw new Error(`Feed request failed for ${feedUrl}: ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();
  const parsed = XML.parse(xml);
  const channel = parsed?.rss?.channel || parsed?.feed || parsed?.channel;
  const rawItems = arrayify(channel?.item || channel?.entry).slice(0, MAX_ITEMS);

  const feedTitle = firstText(channel?.title) || feedUrl;
  const feedDescription = firstText(channel?.description) || firstText(channel?.subtitle);

  const items = rawItems.map((item) => makeRow(feedUrl, item));

  return {
    feedUrl,
    feedTitle,
    feedDescription,
    items,
  };
}

async function ensureSchema(client) {
  await client.query(`
    create table if not exists ${TABLE_NAME} (
      source_id text primary key,
      feed_url text not null,
      source_domain text not null,
      title text not null,
      link text not null,
      guid text,
      author text,
      categories text[] not null default '{}'::text[],
      summary text,
      content_html text,
      content_text text,
      published_at timestamptz,
      checksum text not null,
      raw_item jsonb not null,
      first_seen_at timestamptz not null default now(),
      last_seen_at timestamptz not null default now(),
      seen_count integer not null default 1
    );
  `);

  await client.query(`
    create index if not exists ${TABLE_NAME}_published_at_idx
      on ${TABLE_NAME} (published_at desc nulls last);
  `);
}

async function syncFeedWithPostgres(client, feed) {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of feed.items) {
    const existing = await client.query(
      `select checksum from ${TABLE_NAME} where source_id = $1 limit 1`,
      [item.source_id]
    );

    if (existing.rowCount && existing.rows[0].checksum === item.checksum) {
      skipped += 1;
      continue;
    }

    await client.query(
      `
      insert into ${TABLE_NAME} (
        source_id, feed_url, source_domain, title, link, guid, author, categories,
        summary, content_html, content_text, published_at, checksum, raw_item,
        first_seen_at, last_seen_at, seen_count
      ) values (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14::jsonb,
        coalesce((select first_seen_at from ${TABLE_NAME} where source_id = $1), now()),
        now(),
        coalesce((select seen_count from ${TABLE_NAME} where source_id = $1), 0) + 1
      )
      on conflict (source_id) do update set
        feed_url = excluded.feed_url,
        source_domain = excluded.source_domain,
        title = excluded.title,
        link = excluded.link,
        guid = excluded.guid,
        author = excluded.author,
        categories = excluded.categories,
        summary = excluded.summary,
        content_html = excluded.content_html,
        content_text = excluded.content_text,
        published_at = excluded.published_at,
        checksum = excluded.checksum,
        raw_item = excluded.raw_item,
        last_seen_at = now(),
        seen_count = ${TABLE_NAME}.seen_count + 1
      `,
      [
        item.source_id,
        item.feed_url,
        item.source_domain,
        item.title,
        item.link,
        item.guid,
        item.author,
        item.categories,
        item.summary,
        item.content_html,
        item.content_text,
        item.published_at,
        item.checksum,
        JSON.stringify(item.raw_item),
      ]
    );

    if (existing.rowCount) updated += 1;
    else inserted += 1;
  }

  return { inserted, updated, skipped };
}

async function syncFeedWithSupabase(client, feed) {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of feed.items) {
    const { data: existing, error: selectError } = await client
      .from(TABLE_NAME)
      .select('checksum')
      .eq('source_id', item.source_id)
      .maybeSingle();

    if (selectError) {
      throw new Error(`Supabase lookup failed for ${item.source_id}: ${selectError.message}`);
    }

    if (existing?.checksum === item.checksum) {
      skipped += 1;
      continue;
    }

    const payload = {
      source_id: item.source_id,
      feed_url: item.feed_url,
      source_domain: item.source_domain,
      title: item.title,
      link: item.link,
      guid: item.guid,
      author: item.author,
      categories: item.categories,
      summary: item.summary,
      content_html: item.content_html,
      content_text: item.content_text,
      published_at: item.published_at,
      checksum: item.checksum,
      raw_item: item.raw_item,
      first_seen_at: existing ? undefined : new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      seen_count: existing ? undefined : 1,
    };

    const { error: upsertError } = await client
      .from(TABLE_NAME)
      .upsert(payload, { onConflict: 'source_id' });

    if (upsertError) {
      throw new Error(`Supabase upsert failed for ${item.source_id}: ${upsertError.message}`);
    }

    if (existing) updated += 1;
    else inserted += 1;
  }

  return { inserted, updated, skipped };
}

function getSyncMode() {
  if (hasDatabaseUrl) return 'postgres';
  if (hasSupabaseUrl && hasSupabaseServiceKey) return 'supabase';
  return 'dry-run';
}

async function main() {
  const startedAt = new Date();
  const feeds = [];
  const errors = [];

  for (const feedUrl of RSS_URLS) {
    try {
      const feed = await fetchFeed(feedUrl);
      feeds.push(feed);
    } catch (error) {
      errors.push({ feedUrl, error: error instanceof Error ? error.message : String(error) });
    }
  }

  if (errors.length && !feeds.length) {
    throw new Error(`Unable to fetch any feeds: ${errors.map((entry) => `${entry.feedUrl} (${entry.error})`).join('; ')}`);
  }

  const syncMode = getSyncMode();

  if (!DRY_RUN && syncMode === 'dry-run') {
    throw new Error('No database credentials configured. Set DATABASE_URL or SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.');
  }

  if (syncMode === 'dry-run') {
    const summary = {
      mode: 'dry-run',
      feeds: feeds.map((feed) => ({
        feedUrl: feed.feedUrl,
        feedTitle: feed.feedTitle,
        itemCount: feed.items.length,
        latestTitles: feed.items.slice(0, 5).map((item) => item.title),
      })),
      errors,
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
    };

    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  if (syncMode === 'postgres') {
    const client = await pool.connect();
    try {
      await ensureSchema(client);

      const totals = { inserted: 0, updated: 0, skipped: 0 };
      for (const feed of feeds) {
        const result = await syncFeedWithPostgres(client, feed);
        totals.inserted += result.inserted;
        totals.updated += result.updated;
        totals.skipped += result.skipped;
      }

      const summary = {
        mode: 'db-sync',
        provider: 'postgres',
        table: TABLE_NAME,
        feeds: feeds.map((feed) => ({
          feedUrl: feed.feedUrl,
          feedTitle: feed.feedTitle,
          itemCount: feed.items.length,
        })),
        totals,
        errors,
        startedAt: startedAt.toISOString(),
        finishedAt: new Date().toISOString(),
      };

      console.log(JSON.stringify(summary, null, 2));
    } finally {
      client.release();
    }
    return;
  }

  const totals = { inserted: 0, updated: 0, skipped: 0 };
  for (const feed of feeds) {
    const result = await syncFeedWithSupabase(supabase, feed);
    totals.inserted += result.inserted;
    totals.updated += result.updated;
    totals.skipped += result.skipped;
  }

  const summary = {
    mode: 'db-sync',
    provider: 'supabase',
    table: TABLE_NAME,
    feeds: feeds.map((feed) => ({
      feedUrl: feed.feedUrl,
      feedTitle: feed.feedTitle,
      itemCount: feed.items.length,
    })),
    totals,
    errors,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
}).finally(async () => {
  if (pool) {
    await pool.end().catch(() => {});
  }
});
