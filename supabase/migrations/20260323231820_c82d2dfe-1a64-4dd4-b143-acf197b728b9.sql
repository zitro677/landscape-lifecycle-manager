
-- CLIENTS
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can create their own clients" ON clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;
CREATE POLICY "Authenticated can view all clients" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create clients" ON clients FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated can update all clients" ON clients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all clients" ON clients FOR DELETE TO authenticated USING (true);

-- PROJECTS
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
CREATE POLICY "Authenticated can view all projects" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create projects" ON projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated can update all projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all projects" ON projects FOR DELETE TO authenticated USING (true);

-- INVOICES
DROP POLICY IF EXISTS "Users can view their own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can create their own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can update their own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON invoices;
CREATE POLICY "Authenticated can view all invoices" ON invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create invoices" ON invoices FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated can update all invoices" ON invoices FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all invoices" ON invoices FOR DELETE TO authenticated USING (true);

-- PROPOSALS
DROP POLICY IF EXISTS "Users can view their own proposals" ON proposals;
DROP POLICY IF EXISTS "Users can create their own proposals" ON proposals;
DROP POLICY IF EXISTS "Users can update their own proposals" ON proposals;
DROP POLICY IF EXISTS "Users can delete their own proposals" ON proposals;
CREATE POLICY "Authenticated can view all proposals" ON proposals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create proposals" ON proposals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated can update all proposals" ON proposals FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all proposals" ON proposals FOR DELETE TO authenticated USING (true);

-- EXPENSES
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can create their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;
CREATE POLICY "Authenticated can view all expenses" ON expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create expenses" ON expenses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated can update all expenses" ON expenses FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all expenses" ON expenses FOR DELETE TO authenticated USING (true);

-- INVENTORY
DROP POLICY IF EXISTS "Users can view their own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can create their own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can update their own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can delete their own inventory" ON inventory;
CREATE POLICY "Authenticated can view all inventory" ON inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create inventory" ON inventory FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated can update all inventory" ON inventory FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all inventory" ON inventory FOR DELETE TO authenticated USING (true);

-- TEAM_MEMBERS
DROP POLICY IF EXISTS "Users can view their own team members" ON team_members;
DROP POLICY IF EXISTS "Users can create their own team members" ON team_members;
DROP POLICY IF EXISTS "Users can update their own team members" ON team_members;
DROP POLICY IF EXISTS "Users can delete their own team members" ON team_members;
CREATE POLICY "Authenticated can view all team members" ON team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create team members" ON team_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated can update all team members" ON team_members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all team members" ON team_members FOR DELETE TO authenticated USING (true);

-- INVOICE_ITEMS
DROP POLICY IF EXISTS "Users can view their invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Users can insert their invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Users can update their invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Users can delete their invoice items" ON invoice_items;
CREATE POLICY "Authenticated can view all invoice items" ON invoice_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create invoice items" ON invoice_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update all invoice items" ON invoice_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all invoice items" ON invoice_items FOR DELETE TO authenticated USING (true);

-- PROPOSAL_ITEMS
DROP POLICY IF EXISTS "Users can view their proposal items" ON proposal_items;
DROP POLICY IF EXISTS "Users can insert their proposal items" ON proposal_items;
DROP POLICY IF EXISTS "Users can update their proposal items" ON proposal_items;
DROP POLICY IF EXISTS "Users can delete their proposal items" ON proposal_items;
CREATE POLICY "Authenticated can view all proposal items" ON proposal_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create proposal items" ON proposal_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update all proposal items" ON proposal_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all proposal items" ON proposal_items FOR DELETE TO authenticated USING (true);

-- PROJECT_TASKS
DROP POLICY IF EXISTS "Users can view their project tasks" ON project_tasks;
DROP POLICY IF EXISTS "Users can insert their project tasks" ON project_tasks;
DROP POLICY IF EXISTS "Users can update their project tasks" ON project_tasks;
DROP POLICY IF EXISTS "Users can delete their project tasks" ON project_tasks;
CREATE POLICY "Authenticated can view all project tasks" ON project_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create project tasks" ON project_tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update all project tasks" ON project_tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all project tasks" ON project_tasks FOR DELETE TO authenticated USING (true);

-- PROJECT_NOTES
DROP POLICY IF EXISTS "Users can view their project notes" ON project_notes;
DROP POLICY IF EXISTS "Users can insert their project notes" ON project_notes;
DROP POLICY IF EXISTS "Users can update their project notes" ON project_notes;
DROP POLICY IF EXISTS "Users can delete their project notes" ON project_notes;
CREATE POLICY "Authenticated can view all project notes" ON project_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create project notes" ON project_notes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update all project notes" ON project_notes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all project notes" ON project_notes FOR DELETE TO authenticated USING (true);

-- PROJECT_MATERIALS
DROP POLICY IF EXISTS "Users can view their project materials" ON project_materials;
DROP POLICY IF EXISTS "Users can insert their project materials" ON project_materials;
DROP POLICY IF EXISTS "Users can update their project materials" ON project_materials;
DROP POLICY IF EXISTS "Users can delete their project materials" ON project_materials;
CREATE POLICY "Authenticated can view all project materials" ON project_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create project materials" ON project_materials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update all project materials" ON project_materials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all project materials" ON project_materials FOR DELETE TO authenticated USING (true);

-- PROJECT_TEAM
DROP POLICY IF EXISTS "Users can view their project team" ON project_team;
DROP POLICY IF EXISTS "Users can insert their project team" ON project_team;
DROP POLICY IF EXISTS "Users can update their project team" ON project_team;
DROP POLICY IF EXISTS "Users can delete their project team" ON project_team;
CREATE POLICY "Authenticated can view all project team" ON project_team FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create project team" ON project_team FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update all project team" ON project_team FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete all project team" ON project_team FOR DELETE TO authenticated USING (true);

-- USER_ROLES: allow viewing all roles + admin updates
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can update their own role" ON user_roles;
CREATE POLICY "Authenticated can view all roles" ON user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert roles" ON user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated can update roles" ON user_roles FOR UPDATE TO authenticated USING (true);

-- PROFILES: allow viewing all profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Authenticated can view all profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Update handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE WHEN NEW.email = 'zitro677.lo87@gmail.com' THEN 'admin' ELSE 'read_only' END
  );
  
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  RETURN NEW;
END;
$function$
