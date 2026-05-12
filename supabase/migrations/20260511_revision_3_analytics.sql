alter table if exists materials
  add column if not exists unit_cost numeric not null default 0;

alter table if exists products
  add column if not exists unit_price numeric not null default 0;
