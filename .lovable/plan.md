

## Plan: Fix RLS Security Warnings

Based on the database linter results, there are **2 security warnings** that need to be addressed, plus I'll improve the junction table policies for better security.

---

### Issue 1: Overly Permissive INSERT Policies

The linter flagged two policies with `WITH CHECK (true)`:
- `"System can insert roles"` on `user_roles`
- `"System can insert profiles"` on `profiles`

**Why they exist**: These allow the `handle_new_user()` trigger (which runs as SECURITY DEFINER) to insert records when a user signs up.

**The fix**: Restrict these policies to only allow inserts where the `user_id` matches the authenticated user, while keeping the trigger functional since it runs with elevated privileges.

---

### Issue 2: Junction Table Policies

The junction tables (`invoice_items`, `proposal_items`, `project_tasks`, `project_notes`, `project_materials`, `project_team`) currently use `FOR ALL` policies. These should be split into granular `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies for better security auditing.

---

### Migration Steps

**Step 1**: Update `user_roles` INSERT policy to be more restrictive:
```sql
DROP POLICY IF EXISTS "System can insert roles" ON public.user_roles;
CREATE POLICY "Users can insert their own role"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

**Step 2**: Update `profiles` INSERT policy to be more restrictive:
```sql
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

**Step 3**: Split junction table policies into granular operations for each table:
- `invoice_items` - 4 policies (SELECT, INSERT, UPDATE, DELETE)
- `proposal_items` - 4 policies
- `project_tasks` - 4 policies
- `project_notes` - 4 policies
- `project_materials` - 4 policies
- `project_team` - 4 policies

---

### Technical Details

The migration will:

1. Drop the existing `WITH CHECK (true)` policies on `user_roles` and `profiles`
2. Create new policies that require `auth.uid() = user_id`
3. Drop all `FOR ALL` policies on junction tables
4. Create granular policies with proper `USING` and `WITH CHECK` clauses
5. Use `TO authenticated` role specification for security

**Note**: The `handle_new_user()` trigger will continue to work because it uses `SECURITY DEFINER`, which bypasses RLS policies entirely.

---

### Expected Outcome

After this migration:
- The 2 linter warnings will be resolved
- Junction tables will have explicit, auditable policies
- All policies will specify the `authenticated` role
- Security posture will be improved without breaking functionality

