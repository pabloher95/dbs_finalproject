alter table business
  add column if not exists workspace_mode text;

update business
set workspace_mode = case
  when owner_user_id = 'owner_demo' then 'demo'
  else 'live'
end
where workspace_mode is null;

alter table business
  alter column workspace_mode set default 'live';

alter table business
  alter column workspace_mode set not null;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'business_owner_user_id_key'
  ) then
    alter table business drop constraint business_owner_user_id_key;
  end if;
exception
  when undefined_object then null;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'business_owner_user_id_workspace_mode_key'
  ) then
    alter table business
      add constraint business_owner_user_id_workspace_mode_key
      unique (owner_user_id, workspace_mode);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'business_workspace_mode_check'
  ) then
    alter table business
      add constraint business_workspace_mode_check
      check (workspace_mode in ('live', 'demo'));
  end if;
end $$;
