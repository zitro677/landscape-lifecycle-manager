

# Fix AI Accountant "supabaseKey is required" Error

## Problem
The AI Accountant edge function is crashing because it references `SUPABASE_PUBLISHABLE_KEY` as an environment variable, but the actual secret available is named `SUPABASE_ANON_KEY`.

## Solution
Change the environment variable name in the edge function from `SUPABASE_PUBLISHABLE_KEY` to `SUPABASE_ANON_KEY`.

## Technical Details

**File:** `supabase/functions/accountant-chat/index.ts`

Change line 28:
```text
// FROM:
const supabaseKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

// TO:
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
```

Also add a validation check before creating the client so the error message is clearer if either variable is missing.

