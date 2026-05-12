alter table if exists orders
  add column if not exists destination text not null default '';
