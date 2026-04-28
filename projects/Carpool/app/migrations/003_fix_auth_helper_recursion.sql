-- ============================================================
-- Fix auth_parent_id() recursion under RLS
--
-- Symptom:
--   Anonymous/client REST queries can fail with:
--   "stack depth limit exceeded"
--
-- Cause:
--   auth_parent_id() queried public.parents as an ordinary invoker
--   function. Since parents has RLS policies that themselves call
--   auth_parent_id(), Postgres recursed until it hit max_stack_depth.
--
-- Fix:
--   Make auth_parent_id() SECURITY DEFINER, like
--   team_ids_of_current_parent(), so it resolves the authenticated user
--   -> parent row lookup without invoking the parents RLS policy again.
-- ============================================================

create or replace function auth_parent_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
    from public.parents
   where auth_user_id = auth.uid()
   limit 1
$$;
