create table if not exists material_cost_history (
  id text primary key,
  business_id text not null references business (id) on delete cascade,
  material_id text not null references materials (id) on delete cascade,
  unit_cost numeric not null default 0,
  recorded_at timestamptz not null default now()
);

create index if not exists material_cost_history_business_id_idx
  on material_cost_history (business_id, recorded_at);

alter table material_cost_history enable row level security;

grant select, insert, update, delete on material_cost_history to authenticated;

drop policy if exists material_cost_history_select_own on material_cost_history;
drop policy if exists material_cost_history_insert_own on material_cost_history;
drop policy if exists material_cost_history_update_own on material_cost_history;
drop policy if exists material_cost_history_delete_own on material_cost_history;

create policy material_cost_history_select_own on material_cost_history
  for select
  using (exists (
    select 1 from business
    where business.id = material_cost_history.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy material_cost_history_insert_own on material_cost_history
  for insert
  with check (exists (
    select 1 from business
    where business.id = material_cost_history.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy material_cost_history_update_own on material_cost_history
  for update
  using (exists (
    select 1 from business
    where business.id = material_cost_history.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ))
  with check (exists (
    select 1 from business
    where business.id = material_cost_history.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy material_cost_history_delete_own on material_cost_history
  for delete
  using (exists (
    select 1 from business
    where business.id = material_cost_history.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

insert into material_cost_history (id, business_id, material_id, unit_cost, recorded_at)
values
  ('cost_flour_jan', 'biz_sunday_crumb', 'ing_flour', 0.0075, '2026-01-05T00:00:00Z'),
  ('cost_flour_mar', 'biz_sunday_crumb', 'ing_flour', 0.0084, '2026-03-01T00:00:00Z'),
  ('cost_flour_may', 'biz_sunday_crumb', 'ing_flour', 0.0092, '2026-05-04T00:00:00Z'),
  ('cost_butter_jan', 'biz_sunday_crumb', 'ing_butter', 0.011, '2026-01-07T00:00:00Z'),
  ('cost_butter_apr', 'biz_sunday_crumb', 'ing_butter', 0.0125, '2026-04-09T00:00:00Z'),
  ('cost_butter_may', 'biz_sunday_crumb', 'ing_butter', 0.0132, '2026-05-06T00:00:00Z'),
  ('cost_sugar_jan', 'biz_sunday_crumb', 'ing_sugar', 0.0041, '2026-01-10T00:00:00Z'),
  ('cost_sugar_mar', 'biz_sunday_crumb', 'ing_sugar', 0.0039, '2026-03-17T00:00:00Z'),
  ('cost_sugar_may', 'biz_sunday_crumb', 'ing_sugar', 0.0037, '2026-05-02T00:00:00Z'),
  ('cost_jam_feb', 'biz_sunday_crumb', 'ing_jam', 0.016, '2026-02-11T00:00:00Z'),
  ('cost_jam_apr', 'biz_sunday_crumb', 'ing_jam', 0.0178, '2026-04-15T00:00:00Z'),
  ('cost_jam_may', 'biz_sunday_crumb', 'ing_jam', 0.0185, '2026-05-08T00:00:00Z'),
  ('cost_milk_jan', 'biz_sunday_crumb', 'ing_milk', 0.0055, '2026-01-06T00:00:00Z'),
  ('cost_milk_mar', 'biz_sunday_crumb', 'ing_milk', 0.0059, '2026-03-12T00:00:00Z'),
  ('cost_milk_may', 'biz_sunday_crumb', 'ing_milk', 0.0063, '2026-05-03T00:00:00Z')
on conflict (id) do nothing;
