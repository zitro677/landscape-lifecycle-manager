-- Fix Issue 1: Overly Permissive INSERT Policies
-- Drop existing permissive policies
DROP POLICY IF EXISTS "System can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;

-- Create restrictive INSERT policies
CREATE POLICY "Users can insert their own role"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix Issue 2: Split FOR ALL policies into granular policies

-- invoice_items
DROP POLICY IF EXISTS "Users can manage their invoice items" ON public.invoice_items;

CREATE POLICY "Users can view their invoice items"
  ON public.invoice_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their invoice items"
  ON public.invoice_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their invoice items"
  ON public.invoice_items
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their invoice items"
  ON public.invoice_items
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

-- proposal_items
DROP POLICY IF EXISTS "Users can manage their proposal items" ON public.proposal_items;

CREATE POLICY "Users can view their proposal items"
  ON public.proposal_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = proposal_items.proposal_id
    AND proposals.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their proposal items"
  ON public.proposal_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = proposal_items.proposal_id
    AND proposals.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their proposal items"
  ON public.proposal_items
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = proposal_items.proposal_id
    AND proposals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their proposal items"
  ON public.proposal_items
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = proposal_items.proposal_id
    AND proposals.user_id = auth.uid()
  ));

-- project_tasks
DROP POLICY IF EXISTS "Users can manage their project tasks" ON public.project_tasks;

CREATE POLICY "Users can view their project tasks"
  ON public.project_tasks
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_tasks.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their project tasks"
  ON public.project_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_tasks.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their project tasks"
  ON public.project_tasks
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_tasks.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their project tasks"
  ON public.project_tasks
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_tasks.project_id
    AND projects.user_id = auth.uid()
  ));

-- project_notes
DROP POLICY IF EXISTS "Users can manage their project notes" ON public.project_notes;

CREATE POLICY "Users can view their project notes"
  ON public.project_notes
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_notes.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their project notes"
  ON public.project_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_notes.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their project notes"
  ON public.project_notes
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_notes.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their project notes"
  ON public.project_notes
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_notes.project_id
    AND projects.user_id = auth.uid()
  ));

-- project_materials
DROP POLICY IF EXISTS "Users can manage their project materials" ON public.project_materials;

CREATE POLICY "Users can view their project materials"
  ON public.project_materials
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_materials.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their project materials"
  ON public.project_materials
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_materials.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their project materials"
  ON public.project_materials
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_materials.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their project materials"
  ON public.project_materials
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_materials.project_id
    AND projects.user_id = auth.uid()
  ));

-- project_team
DROP POLICY IF EXISTS "Users can manage their project team" ON public.project_team;

CREATE POLICY "Users can view their project team"
  ON public.project_team
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_team.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their project team"
  ON public.project_team
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_team.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their project team"
  ON public.project_team
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_team.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their project team"
  ON public.project_team
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_team.project_id
    AND projects.user_id = auth.uid()
  ));