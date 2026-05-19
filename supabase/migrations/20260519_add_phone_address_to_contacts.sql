-- Add phone and address fields to clients and suppliers tables.
-- Both columns are optional (nullable text) so existing rows are unaffected.

alter table clients
  add column if not exists phone text,
  add column if not exists address text;

alter table suppliers
  add column if not exists phone text,
  add column if not exists address text;
