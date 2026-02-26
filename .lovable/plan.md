
# Fix Project Editing and Status Changes

## Problems Found

1. **Edit form loads from localStorage instead of database** -- The `useProjectForm.ts` hook tries to find the project in `localStorage` when editing, but projects are stored in the database. This causes "Project not found for editing" errors.

2. **Status values mismatch** -- The `StatusSelector` sends display values like `"In Progress"` to the database, but the database stores normalized lowercase values like `"in_progress"`. This causes the status update to save incorrectly.

## Plan

### 1. Fix `useProjectForm.ts` -- Load project from database for editing
- Replace the localStorage-based `loadProject` function with a database fetch using the Supabase client
- Map database snake_case fields (`start_date`, `end_date`, `hours_estimated`) back to the form's camelCase fields
- Map the database status format (`in_progress`) back to display format (`In Progress`) for the form

### 2. Fix `StatusSelector.tsx` -- Convert status to database format before saving
- Convert the selected status value to snake_case before calling `updateProject` (e.g., `"In Progress"` becomes `"in_progress"`)
- Properly `await` the async `updateProject` call

---

### Technical Details

**File: `src/components/projects/hooks/useProjectForm.ts`**
- Remove all localStorage logic in the `loadProject` function (lines 55-135)
- Replace with: fetch from `supabase.from('projects').select('*').eq('id', id).maybeSingle()`
- Map DB fields to form fields: `start_date` to `startDate`, `end_date` to `dueDate`, `hours_estimated` to `estimatedHours`, and convert status from `in_progress` to `In Progress`

**File: `src/components/projects/detail/components/StatusSelector.tsx`**
- In `handleStatusChange` (line 60), convert the status to DB format: `newStatus.toLowerCase().replace(/ /g, '_')` before passing to `updateProject`
- Add `await` to the `updateProject` call since it's async
- Make `handleStatusChange` an async function
