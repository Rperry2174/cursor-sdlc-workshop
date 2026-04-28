-- ============================================================
-- Co-parent linking RPC
--
-- Two real-world parents who share kids need a way to say "this is my
-- kid too" without creating duplicate children rows. The onboarding
-- wizard's TeamKidsStep handles this when the kid is already on a team
-- the joiner is joining (Jessica claiming Mike's Ben on Express 10U).
-- But it doesn't help with kids that aren't on the joined team
-- (Mike's Lucas and Claire aren't on Express 10U), and it doesn't help
-- when the relationship is added AFTER onboarding.
--
-- This RPC lets one existing parent of a kid grant co-parent status to
-- another parent. Authorization rules:
--   1. Caller must be authenticated.
--   2. Caller must already be a parent of the child (you can only
--      share kids you yourself parent).
--   3. Target parent must share at least one team with the caller
--      (you can only share kids with people you're already coordinating
--      carpool with — not random Supabase users).
--
-- Idempotent: re-calling with an already-linked pair is a no-op.
--
-- Apply order: AFTER 001-013.
-- ============================================================

create or replace function add_coparent_to_child(p_child_id uuid, p_parent_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_parent_id uuid := auth_parent_id();
  v_inserted bool := false;
begin
  if auth.uid() is null then
    raise exception 'add_coparent_to_child requires an authenticated user';
  end if;
  if v_caller_parent_id is null then
    raise exception 'add_coparent_to_child: no parent record for the caller';
  end if;
  if p_child_id is null or p_parent_id is null then
    raise exception 'add_coparent_to_child: child_id and parent_id are required';
  end if;
  if p_parent_id = v_caller_parent_id then
    raise exception 'add_coparent_to_child: cannot add yourself as a co-parent';
  end if;

  -- Caller must already be a parent of this kid.
  if not exists (
    select 1 from parent_children
     where child_id = p_child_id and parent_id = v_caller_parent_id
  ) then
    raise exception 'add_coparent_to_child: caller is not a parent of this child';
  end if;

  -- Target parent must share at least one team with the caller.
  if not exists (
    select 1
      from team_members tm_caller
      join team_members tm_target on tm_target.team_id = tm_caller.team_id
     where tm_caller.parent_id = v_caller_parent_id
       and tm_target.parent_id = p_parent_id
       and tm_caller.removed_at is null
       and tm_target.removed_at is null
  ) then
    raise exception 'add_coparent_to_child: target parent is not on a shared team';
  end if;

  insert into parent_children (parent_id, child_id)
  values (p_parent_id, p_child_id)
  on conflict (parent_id, child_id) do nothing;
  get diagnostics v_inserted = ROW_COUNT;

  return jsonb_build_object(
    'ok', true,
    'inserted', v_inserted > 0,
    'parent_id', p_parent_id,
    'child_id', p_child_id
  );
end;
$$;

grant execute on function add_coparent_to_child(uuid, uuid) to authenticated;

-- Inverse: let a parent remove themselves OR another co-parent from a kid
-- they're a parent of. This is the "I'm not Lucas's parent anymore" or
-- "remove the wrong co-parent I just added" path.
create or replace function remove_coparent_from_child(p_child_id uuid, p_parent_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_parent_id uuid := auth_parent_id();
begin
  if auth.uid() is null then
    raise exception 'remove_coparent_from_child requires an authenticated user';
  end if;
  if v_caller_parent_id is null then
    raise exception 'remove_coparent_from_child: no parent record for the caller';
  end if;

  -- Caller must be a parent of the child to manage its co-parent list.
  if not exists (
    select 1 from parent_children
     where child_id = p_child_id and parent_id = v_caller_parent_id
  ) then
    raise exception 'remove_coparent_from_child: caller is not a parent of this child';
  end if;

  -- Don't allow leaving a kid with zero parents.
  if (select count(*) from parent_children where child_id = p_child_id) <= 1 then
    raise exception 'remove_coparent_from_child: would leave child with no parents';
  end if;

  delete from parent_children
   where child_id = p_child_id and parent_id = p_parent_id;

  return jsonb_build_object('ok', true, 'parent_id', p_parent_id, 'child_id', p_child_id);
end;
$$;

grant execute on function remove_coparent_from_child(uuid, uuid) to authenticated;
