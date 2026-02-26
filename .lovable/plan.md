

# Redesign Proposal PDF to Match HTML Template Exactly

## Problem
The current PDF output doesn't match the HTML template you provided (proposal_gli.txt). Several layout differences and missing fields need to be fixed.

## Key Differences Found

Comparing your uploaded PDF (current output) vs the HTML template:

1. **Meta card is missing "Status"** -- was removed in a prior change, but the template includes it (e.g., "Pending Approval")
2. **Items table missing row numbers (#)** -- template has a "#" column as the first column
3. **Section ordering is wrong** -- currently: Items Table -> Totals Box -> Scope -> Timeline -> Notes. Template shows: Items Table -> Scope -> Timeline -> Totals Box -> Notes
4. **Totals box position** -- should appear AFTER scope/timeline, not immediately after the items table
5. **"Scope of Services" label** -- currently used as the items table header, but in the template it's the table section title with subtitle "Detailed breakdown of work to be completed" (this part looks correct in code but may not render)

## Plan

### 1. Re-add Status to meta card
**File: `src/components/proposals/utils/pdf/clientSection.ts`**
- Add a 4th row to the meta card: `{ label: "STATUS", value: proposal.status }` with capitalized display
- Increase meta card height from 44 to 54 to fit

### 2. Add row number (#) column to items table
**File: `src/components/proposals/utils/pdf/pricingSection.ts`**
- Add "#" as first column header
- Prepend row index (1, 2, 3...) to each body row
- Adjust column widths: # column narrow (~8%), Description ~44%, Qty ~12%, Unit Price ~18%, Amount ~18%

### 3. Restructure section ordering -- separate totals from items
**File: `src/components/proposals/utils/pdf/pricingSection.ts`**
- Split into two exports: `addServicesTable` (just the table) and `addTotalsBox` (just the dark green totals summary)
- This allows the orchestrator to place them in the correct order

**File: `src/components/proposals/utils/pdfSections.ts`**
- Export the new `addTotalsBox` function

**File: `src/components/proposals/ProposalPdfGenerator.tsx`**
- Reorder to: Header -> Client/Title -> Items Table -> Scope/Timeline -> Totals Box -> Terms/Notes -> Footer

### 4. Ensure all content sections render correctly
**File: `src/components/proposals/utils/pdf/contentSections.ts`**
- No structural changes needed, just ensure scope and timeline render before the totals box
- Split notes into a separate export so it can go after totals

## Files to Modify (5 files)

| File | Change |
|------|--------|
| `clientSection.ts` | Re-add Status row to meta card |
| `pricingSection.ts` | Add # column, split into table + totals functions |
| `contentSections.ts` | Split notes from scope/timeline for reordering |
| `pdfSections.ts` | Export new split functions |
| `ProposalPdfGenerator.tsx` | Reorder sections to match template |

## Section Order (After Fix)
```text
1. Dark green header (logo, company name, contact)
2. Title section (Official Proposal, title, client, meta card with status)
3. Items & Services table (with # column)
4. Project Details (scope with checkmarks)
5. Estimated Timeline
6. Totals box (Subtotal, Tax, Total Investment)
7. Terms & Conditions (notes)
8. Footer (thank you + page numbers)
```

