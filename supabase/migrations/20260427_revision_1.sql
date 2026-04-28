create table if not exists business (
  id text primary key,
  name text not null,
  owner_user_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists suppliers (
  id text primary key,
  business_id text not null references business (id) on delete cascade,
  name text not null,
  email text not null,
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists materials (
  id text primary key,
  business_id text not null references business (id) on delete cascade,
  name text not null,
  unit text not null,
  preferred_supplier_id text references suppliers (id),
  on_hand_quantity numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key,
  business_id text not null references business (id) on delete cascade,
  sku text not null,
  name text not null,
  category text not null,
  unit text not null,
  yield_quantity numeric not null,
  created_at timestamptz not null default now(),
  unique (business_id, sku)
);

create table if not exists product_materials (
  product_id text not null references products (id) on delete cascade,
  material_id text not null references materials (id) on delete cascade,
  quantity numeric not null,
  unit text not null,
  primary key (product_id, material_id)
);

create table if not exists clients (
  id text primary key,
  business_id text not null references business (id) on delete cascade,
  name text not null,
  email text not null,
  channel text not null,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  business_id text not null references business (id) on delete cascade,
  client_id text not null references clients (id),
  order_number text not null,
  due_date date not null,
  status text not null check (status in ('draft', 'open', 'fulfilled')),
  created_at timestamptz not null default now(),
  unique (business_id, order_number)
);

create table if not exists order_items (
  order_id text not null references orders (id) on delete cascade,
  product_id text not null references products (id),
  quantity numeric not null,
  primary key (order_id, product_id)
);

insert into business (id, name, owner_user_id)
values ('biz_sunday_crumb', 'Sunday Crumb Bakehouse', 'owner_demo')
on conflict (id) do nothing;

insert into suppliers (id, business_id, name, email, category)
values
  ('sup_mill', 'biz_sunday_crumb', 'Red River Mill', 'orders@redrivermill.test', 'flour'),
  ('sup_dairy', 'biz_sunday_crumb', 'Lark Dairy Co.', 'sales@larkdairy.test', 'dairy'),
  ('sup_pantry', 'biz_sunday_crumb', 'Hearth Pantry', 'hello@hearthpantry.test', 'pantry')
on conflict (id) do nothing;

insert into materials (id, business_id, name, unit, preferred_supplier_id, on_hand_quantity)
values
  ('ing_flour', 'biz_sunday_crumb', 'Flour', 'g', 'sup_mill', 0),
  ('ing_butter', 'biz_sunday_crumb', 'Butter', 'g', 'sup_dairy', 0),
  ('ing_sugar', 'biz_sunday_crumb', 'Sugar', 'g', 'sup_pantry', 0),
  ('ing_jam', 'biz_sunday_crumb', 'Berry Jam', 'g', 'sup_pantry', 0),
  ('ing_milk', 'biz_sunday_crumb', 'Milk', 'g', 'sup_dairy', 0)
on conflict (id) do nothing;

insert into products (id, business_id, sku, name, category, unit, yield_quantity)
values
  ('prd_croissant', 'biz_sunday_crumb', 'CROISSANT', 'Butter Croissant', 'pastry', 'each', 12),
  ('prd_scone', 'biz_sunday_crumb', 'JAM-SCONE', 'Jam Scone', 'breakfast', 'each', 8)
on conflict (id) do nothing;

insert into product_materials (product_id, material_id, quantity, unit)
values
  ('prd_croissant', 'ing_flour', 1200, 'g'),
  ('prd_croissant', 'ing_butter', 750, 'g'),
  ('prd_croissant', 'ing_milk', 250, 'g'),
  ('prd_scone', 'ing_flour', 950, 'g'),
  ('prd_scone', 'ing_butter', 300, 'g'),
  ('prd_scone', 'ing_sugar', 120, 'g'),
  ('prd_scone', 'ing_jam', 360, 'g')
on conflict (product_id, material_id) do nothing;

insert into clients (id, business_id, name, email, channel)
values
  ('cl_river', 'biz_sunday_crumb', 'River Market Cafe', 'orders@rivermarket.test', 'wholesale cafe'),
  ('cl_studio', 'biz_sunday_crumb', 'North Studio Events', 'events@northstudio.test', 'event catering')
on conflict (id) do nothing;

insert into orders (id, business_id, client_id, order_number, due_date, status)
values
  ('ord_2001', 'biz_sunday_crumb', 'cl_river', 'ORD-2001', '2026-04-29', 'open'),
  ('ord_2002', 'biz_sunday_crumb', 'cl_studio', 'ORD-2002', '2026-04-30', 'open')
on conflict (id) do nothing;

insert into order_items (order_id, product_id, quantity)
values
  ('ord_2001', 'prd_croissant', 48),
  ('ord_2001', 'prd_scone', 24),
  ('ord_2002', 'prd_croissant', 36)
on conflict (order_id, product_id) do nothing;

do $$
begin
  alter table business add constraint business_owner_user_id_key unique (owner_user_id);
exception
  when duplicate_object then null;
end $$;

alter table business enable row level security;
alter table suppliers enable row level security;
alter table materials enable row level security;
alter table products enable row level security;
alter table product_materials enable row level security;
alter table clients enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists business_select_own on business;
drop policy if exists business_insert_own on business;
drop policy if exists business_update_own on business;
drop policy if exists business_delete_own on business;

create policy business_select_own on business
  for select
  using (owner_user_id = coalesce(auth.jwt() ->> 'sub', ''));

create policy business_insert_own on business
  for insert
  with check (owner_user_id = coalesce(auth.jwt() ->> 'sub', ''));

create policy business_update_own on business
  for update
  using (owner_user_id = coalesce(auth.jwt() ->> 'sub', ''))
  with check (owner_user_id = coalesce(auth.jwt() ->> 'sub', ''));

create policy business_delete_own on business
  for delete
  using (owner_user_id = coalesce(auth.jwt() ->> 'sub', ''));

drop policy if exists suppliers_select_own on suppliers;
drop policy if exists suppliers_insert_own on suppliers;
drop policy if exists suppliers_update_own on suppliers;
drop policy if exists suppliers_delete_own on suppliers;

create policy suppliers_select_own on suppliers
  for select
  using (exists (
    select 1 from business
    where business.id = suppliers.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy suppliers_insert_own on suppliers
  for insert
  with check (exists (
    select 1 from business
    where business.id = suppliers.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy suppliers_update_own on suppliers
  for update
  using (exists (
    select 1 from business
    where business.id = suppliers.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ))
  with check (exists (
    select 1 from business
    where business.id = suppliers.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy suppliers_delete_own on suppliers
  for delete
  using (exists (
    select 1 from business
    where business.id = suppliers.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

drop policy if exists materials_select_own on materials;
drop policy if exists materials_insert_own on materials;
drop policy if exists materials_update_own on materials;
drop policy if exists materials_delete_own on materials;

create policy materials_select_own on materials
  for select
  using (exists (
    select 1 from business
    where business.id = materials.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy materials_insert_own on materials
  for insert
  with check (exists (
    select 1 from business
    where business.id = materials.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy materials_update_own on materials
  for update
  using (exists (
    select 1 from business
    where business.id = materials.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ))
  with check (exists (
    select 1 from business
    where business.id = materials.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy materials_delete_own on materials
  for delete
  using (exists (
    select 1 from business
    where business.id = materials.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

drop policy if exists products_select_own on products;
drop policy if exists products_insert_own on products;
drop policy if exists products_update_own on products;
drop policy if exists products_delete_own on products;

create policy products_select_own on products
  for select
  using (exists (
    select 1 from business
    where business.id = products.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy products_insert_own on products
  for insert
  with check (exists (
    select 1 from business
    where business.id = products.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy products_update_own on products
  for update
  using (exists (
    select 1 from business
    where business.id = products.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ))
  with check (exists (
    select 1 from business
    where business.id = products.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy products_delete_own on products
  for delete
  using (exists (
    select 1 from business
    where business.id = products.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

drop policy if exists product_materials_select_own on product_materials;
drop policy if exists product_materials_insert_own on product_materials;
drop policy if exists product_materials_update_own on product_materials;
drop policy if exists product_materials_delete_own on product_materials;

create policy product_materials_select_own on product_materials
  for select
  using (exists (
    select 1
    from products
    join business on business.id = products.business_id
    where products.id = product_materials.product_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy product_materials_insert_own on product_materials
  for insert
  with check (exists (
    select 1
    from products
    join business on business.id = products.business_id
    where products.id = product_materials.product_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy product_materials_update_own on product_materials
  for update
  using (exists (
    select 1
    from products
    join business on business.id = products.business_id
    where products.id = product_materials.product_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ))
  with check (exists (
    select 1
    from products
    join business on business.id = products.business_id
    where products.id = product_materials.product_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy product_materials_delete_own on product_materials
  for delete
  using (exists (
    select 1
    from products
    join business on business.id = products.business_id
    where products.id = product_materials.product_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

drop policy if exists clients_select_own on clients;
drop policy if exists clients_insert_own on clients;
drop policy if exists clients_update_own on clients;
drop policy if exists clients_delete_own on clients;

create policy clients_select_own on clients
  for select
  using (exists (
    select 1 from business
    where business.id = clients.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy clients_insert_own on clients
  for insert
  with check (exists (
    select 1 from business
    where business.id = clients.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy clients_update_own on clients
  for update
  using (exists (
    select 1 from business
    where business.id = clients.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ))
  with check (exists (
    select 1 from business
    where business.id = clients.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy clients_delete_own on clients
  for delete
  using (exists (
    select 1 from business
    where business.id = clients.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

drop policy if exists orders_select_own on orders;
drop policy if exists orders_insert_own on orders;
drop policy if exists orders_update_own on orders;
drop policy if exists orders_delete_own on orders;

create policy orders_select_own on orders
  for select
  using (exists (
    select 1 from business
    where business.id = orders.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy orders_insert_own on orders
  for insert
  with check (exists (
    select 1 from business
    where business.id = orders.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy orders_update_own on orders
  for update
  using (exists (
    select 1 from business
    where business.id = orders.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ))
  with check (exists (
    select 1 from business
    where business.id = orders.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy orders_delete_own on orders
  for delete
  using (exists (
    select 1 from business
    where business.id = orders.business_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

drop policy if exists order_items_select_own on order_items;
drop policy if exists order_items_insert_own on order_items;
drop policy if exists order_items_update_own on order_items;
drop policy if exists order_items_delete_own on order_items;

create policy order_items_select_own on order_items
  for select
  using (exists (
    select 1
    from orders
    join business on business.id = orders.business_id
    where orders.id = order_items.order_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy order_items_insert_own on order_items
  for insert
  with check (exists (
    select 1
    from orders
    join business on business.id = orders.business_id
    where orders.id = order_items.order_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy order_items_update_own on order_items
  for update
  using (exists (
    select 1
    from orders
    join business on business.id = orders.business_id
    where orders.id = order_items.order_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ))
  with check (exists (
    select 1
    from orders
    join business on business.id = orders.business_id
    where orders.id = order_items.order_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));

create policy order_items_delete_own on order_items
  for delete
  using (exists (
    select 1
    from orders
    join business on business.id = orders.business_id
    where orders.id = order_items.order_id
      and business.owner_user_id = coalesce(auth.jwt() ->> 'sub', '')
  ));
