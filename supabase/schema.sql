-- ─── IDEAS ────────────────────────────────────────────────────────────────────
create table if not exists ideas (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  idea_text    text not null,
  industry     text,
  target       text,
  model        text,
  geography    text,
  stage        text,
  budget       int,
  notes        text
);

-- ─── ANALYSES ─────────────────────────────────────────────────────────────────
create table if not exists analyses (
  id             uuid primary key default gen_random_uuid(),
  idea_id        uuid references ideas(id) on delete cascade,
  created_at     timestamptz default now(),
  status         text not null default 'pending',
  overall_score  int,
  verdict        text,
  summary        text,
  one_liner      text,
  idea_summary   text,
  dimensions     jsonb,
  metrics        jsonb,
  revenue_models jsonb,
  mrr_potential  text,
  top_risks      jsonb,
  next_steps     jsonb,
  market_size    text,
  demand_signal  text,
  competition    text,
  recommendations jsonb,
  raw_response   text
);

create index if not exists analyses_idea_id_idx on analyses(idea_id);
create index if not exists analyses_status_idx on analyses(status);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────
create table if not exists orders (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz default now(),
  analysis_id        uuid references analyses(id) on delete cascade,
  tier               text not null,
  amount             int not null,
  currency           text not null default 'usd',
  status             text not null default 'pending',
  stripe_session_id  text unique,
  stripe_payment_id  text,
  customer_email     text,
  customer_name      text,
  pdf_url            text,
  brand_kit_url      text,
  delivered_at       timestamptz
);

create index if not exists orders_analysis_id_idx on orders(analysis_id);
create index if not exists orders_stripe_session_idx on orders(stripe_session_id);
create index if not exists orders_status_idx on orders(status);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
alter table ideas    enable row level security;
alter table analyses enable row level security;
alter table orders   enable row level security;

create policy "public read analyses" on analyses for select using (true);
create policy "public read orders"   on orders   for select using (true);

-- ─── ADD BRAND KIT COLUMN (run if upgrading existing DB) ──────────────────────
alter table analyses add column if not exists brand_kit jsonb;
