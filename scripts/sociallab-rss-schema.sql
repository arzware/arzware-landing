-- SocialLab RSS ingestion schema
-- Run this against a PostgreSQL-compatible cloud database.

create table if not exists sociallab_rss_items (
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

create index if not exists sociallab_rss_items_published_at_idx
  on sociallab_rss_items (published_at desc nulls last);

create index if not exists sociallab_rss_items_last_seen_at_idx
  on sociallab_rss_items (last_seen_at desc);
