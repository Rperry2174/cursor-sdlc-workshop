# Database migrations

These SQL files are **not yet applied** — the prototype still runs on
`localStorage` via `src/data/store.js`. They exist now so that when we
flip to Supabase the schema, indexes, and Row-Level Security policies
are already designed and reviewed.

## How to apply (when you're ready)

1. Create a new Supabase project at https://supabase.com
2. In the SQL Editor, run the files **in order**:
   - `001_initial_schema.sql` — tables, indexes, foreign keys
   - `002_rls_policies.sql` — Row-Level Security: who can see what
3. In the Supabase dashboard, **enable RLS on every table**
   (the second migration sets the policies but RLS must be turned on
   per-table; the script does this with `ALTER TABLE ... ENABLE ROW
   LEVEL SECURITY`)
4. Generate types: `npx supabase gen types typescript --project-id <id>`
5. Replace the body of `src/data/store.js` with Supabase client calls
   (see notes per-function — most queries are already scoped by
   `team_id`, which is the partitioning key these RLS policies enforce)

## Why team_id is the partitioning key

Every meaningful query in this app boils down to "for the team(s) I
belong to, show me X." Using `team_id` as the consistent boundary:

- Lets us scale to 100,000+ teams without slow queries (every index
  is `(team_id, …)`)
- Makes RLS trivial: "you can SELECT a row iff you're a member of
  that team"
- Means we never accidentally show data from another team if a
  `WHERE` clause is forgotten — the database itself blocks it

The seed data and current `store.js` queries already follow this
pattern, so the port is mostly mechanical.

## Files

- `001_initial_schema.sql` — schema mirror of the in-memory store
- `002_rls_policies.sql` — RLS policies enforcing team-membership
