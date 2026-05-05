do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'business_owner_user_id_key'
  ) then
    alter table business add constraint business_owner_user_id_key unique (owner_user_id);
  end if;
end $$;

alter table business enable row level security;
alter table suppliers enable row level security;
alter table materials enable row level security;
alter table products enable row level security;
alter table product_materials enable row level security;
alter table clients enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on business to authenticated;
grant select, insert, update, delete on suppliers to authenticated;
grant select, insert, update, delete on materials to authenticated;
grant select, insert, update, delete on products to authenticated;
grant select, insert, update, delete on product_materials to authenticated;
grant select, insert, update, delete on clients to authenticated;
grant select, insert, update, delete on orders to authenticated;
grant select, insert, update, delete on order_items to authenticated;

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
