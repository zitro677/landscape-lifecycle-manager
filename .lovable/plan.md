
Goal: make Proposal PDFs always show line items (description, quantity, unit price, amount) and redesign the document to look professional.

What I found (root cause confirmed)
1. Line items are never saved:
   - `proposal_items` inserts currently send a non-existent `type` column.
   - Network logs show 400 errors: `Could not find the 'type' column of 'proposal_items'`.
   - Because of that, `proposal_items` stays empty, so PDF receives no items.
2. Errors are swallowed:
   - Creation flow catches item insert errors and still reports success.
3. PDF generator still renders an empty “Items & Services” section from legacy parsing:
   - `contentSections` always includes the section keys and prints fallback text (`No items & services provided`), which looks unprofessional.

Implementation plan

1) Fix line-item persistence (highest priority)
- File: `src/components/proposals/api/create/proposalItemOperations.ts`
  - Remove all `type` usage from insert payloads.
  - Keep only schema-valid fields: `proposal_id`, `description`, `quantity`, `unit_price`, `amount`.
  - Compute `amount = quantity * unit_price` before insert.
  - Stop inserting scope/timeline/notes into `proposal_items` (they belong to `proposals` table fields).
- File: `src/components/proposals/api/create/createProposal.ts`
  - Remove `addProposalContentSections` call.
  - Make line-item insert failures fail loudly (no silent success).
  - Optionally rollback just-created proposal record if item insert fails, to avoid half-saved records.
- File: `src/components/proposals/api/update/updateProposal.ts`
  - Remove legacy `content` update (column is not in current schema).
  - Update structured fields directly (`scope`, `timeline`, `notes`, `amount`, dates/title).
  - Reinsert line items with corrected payload (no `type`).
  - Remove `addProposalContentSections`.

2) Ensure fetch shape is stable for PDF
- File: `src/components/proposals/api/fetch/getProposals.ts`
  - Keep `proposal_items (*)` select.
  - Keep `items` mapping, but map to a new array (avoid circular-reference logging artifacts).
- File: `src/components/proposals/api/fetch/getProposalById.ts`
  - Keep alias `items: proposal_items (*)` and verify this remains the source used for edit/PDF.

3) Redesign Proposal PDF for a professional look
- File: `src/components/proposals/ProposalPdfGenerator.tsx`
  - Use a clean section flow:
    1) branded header
    2) client/proposal info cards
    3) itemized table
    4) pricing summary card
    5) scope/timeline/notes cards
    6) footer with generation date + page numbers
- File: `src/components/proposals/utils/pdf/pricingSection.ts`
  - Render polished `autoTable` with:
    - strong header style
    - alternating row shading
    - right-aligned currency columns
    - explicit totals row
  - Use real line-item data for subtotal; only use proposal total fallback when no items exist.
- File: `src/components/proposals/utils/pdf/contentSections.ts`
  - Stop parsing synthetic concatenated text for proposal sections.
  - Accept structured section values and render only non-empty sections.
  - Remove the automatic “No items & services provided” text entirely.

4) Backward compatibility for already-broken proposals
- Existing proposals created while bug existed have missing item rows in the database.
- Since exact qty/price cannot be reconstructed from total alone, we’ll:
  - show a clean fallback row (e.g., “Project services”) only when no line items exist, OR
  - leave table empty but without unprofessional placeholder text.
- After fix, newly created/updated proposals will persist real item rows correctly.

Validation plan (end-to-end)
1. Create a new proposal with at least 2 items.
2. Confirm backend request to `proposal_items` succeeds (no 400).
3. Generate PDF and verify Description + Qty + Unit Price + Amount are present.
4. Edit same proposal, change quantities/prices, regenerate PDF, verify updates.
5. Check an older broken proposal to ensure graceful fallback formatting (no “No items & services provided” wording).

Technical notes
- No database migration is required; schema already supports line items.
- Main issue is application code writing invalid columns and swallowing failures.
- This fix aligns with the current structured model (`scope/timeline/notes` on proposal, line items in `proposal_items`).
