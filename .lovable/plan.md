

# Plan: Shared Data Workspace with Admin Role Fix

## Problem
Currently, RLS policies use `auth.uid() = user_id` on every table, so each user only sees their own data. Both users need to see and work with the same data. Additionally, `zitro677.lo87@gmail.com` should be the admin.

## Changes

### 1. Database Migration: Update RLS Policies for Shared Access

Update RLS policies on all data tables so **all authenticated users** can read, insert, update, and delete all rows (shared workspace). Affected tables:
- `clients`, `projects`, `invoices`, `proposals`, `expenses`, `inventory`, `team_members`
- Junction tables: `invoice_items`, `proposal_items`, `project_tasks`, `project_notes`, `project_materials`, `project_team`

For each table, drop existing policies and create new ones using `true` for authenticated users instead of `auth.uid() = user_id`.

For INSERT policies on tables with `user_id`, keep `WITH CHECK (auth.uid() = user_id)` so the creator's ID is properly recorded, but SELECT/UPDATE/DELETE will be open to all authenticated users.

### 2. Database Migration: Fix Admin Role Assignment

Update the `handle_new_user()` trigger function so that `zitro677.lo87@gmail.com` is always assigned admin. Also run a data update to set the correct roles for both users now.

### 3. Code Change: Clean Up Role Management

Simplify `useRoleManagement.tsx` to remove the hardcoded email checks for `greenplanetlandscaping01@gmail.com` (no longer admin). Keep only the standard role fetch logic.

### Technical Details

**RLS policy pattern for shared access (example for `projects`):**
```sql
-- SELECT: all authenticated users see all projects
CREATE POLICY "Authenticated users can view all projects"
  ON projects FOR SELECT TO authenticated USING (true);

-- INSERT: user_id must match auth.uid()
CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- UPDATE/DELETE: all authenticated users
CREATE POLICY "Authenticated users can update all projects"
  ON projects FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete all projects"
  ON projects FOR DELETE TO authenticated USING (true);
```

This pattern applies to all 13 tables listed above.

**Role fix SQL:**
```sql
UPDATE user_roles SET role = 'admin' 
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'zitro677.lo87@gmail.com');
UPDATE user_roles SET role = 'read_only' 
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'greenplanetlandscaping01@gmail.com');
```

