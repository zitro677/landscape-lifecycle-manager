

# Fix Proposal PDF: Show Items Always + Branded Professional Redesign

## Root Cause (Confirmed via Database)

The item persistence fix from earlier IS working -- the newest proposal (PROP-MM3L6PV5) has 2 items saved correctly in the database. However, the older proposal being tested (PROP-MM3JSJ7N) was created before the fix and has **zero items in the database**. The current PDF code skips the items table entirely when the array is empty.

## Plan

### 1. Add fallback item for proposals with no saved items
**File: `src/components/proposals/ProposalPdfGenerator.tsx`**
- When `items` array is empty but `proposal.amount > 0`, auto-create a single fallback item:
  - Description: "Project Services"
  - Quantity: 1
  - Unit Price: proposal.amount
  - Amount: proposal.amount
- This ensures every proposal PDF shows at least one row in the items table

### 2. Redesign the full PDF with branded professional style
**File: `src/components/proposals/ProposalPdfGenerator.tsx`** (orchestrator)
- Reorder sections for better flow:
  1. Branded header (logo + company info + green accent bar)
  2. Proposal number prominently displayed
  3. Client info card (left) + Proposal details card (right) -- side by side
  4. Items & Services table (always visible)
  5. Pricing summary card (right-aligned totals box)
  6. Scope / Timeline / Notes sections with branded card headers
  7. Footer with company contact + page numbers

**File: `src/components/proposals/utils/pdf/pricingSection.ts`**
- Always render the items table (never skip it)
- Use bold green header row with white text
- Alternating row shading (light green stripes)
- Right-aligned currency columns
- Add a subtotal row inside the table
- Move the totals summary box directly below the table

**File: `src/components/proposals/utils/pdf/headerSection.ts`**
- Add proposal number display below the "PROPOSAL" title
- Tighten spacing for a more compact, professional header

**File: `src/components/proposals/utils/pdf/clientSection.ts`**
- Slightly taller card to accommodate all client fields
- Consistent font sizing

**File: `src/components/proposals/utils/pdf/proposalSection.ts`**
- Remove the "Status" line from the PDF (matching the invoice PDF change)

**File: `src/components/proposals/utils/pdf/contentSections.ts`**
- No changes needed (already clean)

### 3. Files to modify (6 files total)
1. `src/components/proposals/ProposalPdfGenerator.tsx` -- fallback item logic + pass proposal_number
2. `src/components/proposals/utils/pdf/pricingSection.ts` -- always show table, improved styling
3. `src/components/proposals/utils/pdf/headerSection.ts` -- add proposal number
4. `src/components/proposals/utils/pdf/proposalSection.ts` -- remove status line
5. `src/components/proposals/utils/pdf/clientSection.ts` -- minor spacing fix
6. `src/components/proposals/utils/pdf/contentSections.ts` -- no functional changes, just ensure clean rendering

### Technical Details

**Fallback item logic (in ProposalPdfGenerator.tsx):**
```text
if items is empty AND proposal.amount > 0:
  items = [{ description: "Project Services", quantity: 1, unit_price: proposal.amount, amount: proposal.amount }]
```

**Items table (in pricingSection.ts):**
- Always render autoTable regardless of items length
- If items is truly empty AND amount is 0, show single row "No services listed" with $0.00

**No database changes required.** The fix is purely in the PDF rendering layer.

