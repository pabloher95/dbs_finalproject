-- Add phone and address fields to clients and suppliers tables.
-- Both columns are optional (nullable text) so existing rows are unaffected.

alter table clients
  add column if not exists phone text,
  add column if not exists address text;

alter table suppliers
  add column if not exists phone text,
  add column if not exists address text;

-- Extend the orders status constraint to allow 'cancelled'.

alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('draft', 'open', 'fulfilled', 'cancelled'));
