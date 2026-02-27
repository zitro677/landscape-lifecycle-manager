

# Redesign Invoice PDF to Match Proposal PDF Style

## Overview
Rewrite `InvoicePdfGenerator.tsx` to use the same professional branded design as the proposal PDF, reusing shared utility functions where possible and adapting the layout for invoice-specific data.

## Layout Structure (matching proposal PDF)

1. **Gradient Header** - Reuse `addHeaderSection()` with title "INVOICE"
2. **Title/Meta Section** - New invoice-specific section with:
   - Left side: "OFFICIAL INVOICE" label, Invoice number as title, "Bill To:" client info (name, address, email)
   - Right side: Meta card with Invoice #, Issue Date, Due Date, Status badge
3. **Services Table** - Reuse `addServicesTable()` with invoice items
4. **Totals Box + Notes side-by-side** - Notes on the left (if any), Totals box on the right using `addTotalsBox()`
5. **Footer** - "Thank you" message + page numbers, same as proposal

## Files to Modify

### 1. `src/components/invoices/InvoicePdfGenerator.tsx` (full rewrite)
- Import shared functions: `addHeaderSection`, `addServicesTable`, `addTotalsBox`, `addNotesSection`
- Import `formatDate` from proposal formatters
- Build the same layout sequence as proposal but adapted for invoice fields:
  - Use `invoice.invoice_number` instead of proposal title
  - Use `invoice.issue_date` and `invoice.due_date` instead of issue/valid dates
  - Show client address/email on the left side
  - Use `invoice.status` for the status badge
- Build items array from `invoice.items` with fallback to single "Services" row
- Use the same totals box with tax calculation
- Add notes section if invoice has notes
- Add footer with page numbers

### No new files needed
All shared PDF utilities already exist and are reusable. The invoice generator just needs to call them with invoice data instead of proposal data.

## Technical Details

| Section | Function | Source |
|---------|----------|--------|
| Header | `addHeaderSection(doc, "INVOICE", 0, pageWidth)` | Shared |
| Client/Meta | Custom inline (similar to `addClientInformationSection` but for invoice fields) | New inline code |
| Table | `addServicesTable(doc, margin, y, contentWidth, items)` | Shared |
| Totals | `addTotalsBox(doc, amount, margin, y, pageWidth)` | Shared |
| Notes | `addNotesSection(doc, notes, margin, contentWidth, y)` | Shared |
| Footer | Inline (same pattern as proposal) | Copied pattern |

