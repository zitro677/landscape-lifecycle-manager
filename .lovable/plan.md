

# Change Invoice & Proposal Number Format to Year-Sequential

## Current State
- **Invoices**: `INV-2026-{random4digits}` (random, not sequential)
- **Proposals**: `PROP-{base36timestamp}` (timestamp-based, not sequential)

## New Format
- **Invoices**: `INV-2026-1001`, `INV-2026-1002`, ...
- **Proposals**: `PROP-2026-1001`, `PROP-2026-1002`, ...

Each year resets to 1001. The next number is determined by querying the database for the highest existing number in the current year.

## Files to Modify (3 files)

### 1. `src/components/invoices/form/hooks/useInvoiceDetails.ts`
- Replace random generation with a DB query: fetch invoices where `invoice_number LIKE 'INV-{year}-%'`, extract the max sequential number, and use max+1 (or 1001 if none exist).

### 2. `src/components/invoices/form/hooks/useInvoiceSubmission.ts`
- Same change to its `generateInvoiceNumber` function (duplicate of the above).

### 3. `src/components/proposals/api/create/createProposal.ts`
- Replace `PROP-${Date.now().toString(36).toUpperCase()}` with a DB query: fetch proposals where `proposal_number LIKE 'PROP-{year}-%'`, extract the max sequential number, use max+1 or 1001.

### Also update fallback in `useInvoiceMutations.ts`
- Change the fallback `INV-${Date.now()}` to use the same sequential logic or at minimum match the new format pattern.

## Approach
For each, create an async helper that:
1. Queries the relevant table filtering by `invoice_number ILIKE 'INV-{year}-%'` (or `proposal_number ILIKE 'PROP-{year}-%'`)
2. Extracts the numeric suffix from each match
3. Returns `{PREFIX}-{year}-{max + 1}` or `{PREFIX}-{year}-1001` if no matches

