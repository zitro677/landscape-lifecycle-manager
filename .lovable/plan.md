

# Fix Proposal PDF - Make It Compact and Professional

## Problems Identified (Current vs HTML Template)

Comparing the actual PDF output (page screenshots) with your HTML template images:

1. **Header is too large**: Logo is 32mm (huge), company name font too big, contact info overlaps
2. **Title section has too much padding**: "OFFICIAL PROPOSAL" + title + client name section takes too much vertical space
3. **Meta card spacing is loose**: Rows have too much vertical gap between them
4. **Services table is bloated**: Cell padding of 8-10mm makes rows extremely tall; "Qty" header wraps to two lines; amounts wrap to two lines
5. **Scope + Totals section**: Side-by-side layout works but widths and spacing are off
6. **Terms section on page 2**: Should fit on page 1 with everything else
7. **Overall**: Font sizes are 20-50% too large throughout, causing the document to be 2 pages instead of 1

## Changes Required

### 1. Header (`headerSection.ts`) - Make compact
- Reduce header height from 56mm to 40mm
- Reduce logo from 32mm to 22mm
- Reduce company name font from 18pt to 14pt
- Reduce tagline font from 9pt to 7pt
- Tighten contact info spacing

### 2. Client/Title Section (`clientSection.ts`) - Tighten layout
- Reduce section height from 62mm to 48mm
- Reduce title font from 20pt to 16pt
- Reduce "OFFICIAL PROPOSAL" font from 8pt to 7pt
- Reduce meta card height from 50mm to 42mm
- Tighten meta row spacing from 9mm to 8mm gap

### 3. Services Table (`pricingSection.ts`) - Fix wrapping and padding
- Reduce "Scope of Services" heading from 16pt to 13pt
- Reduce head cell padding from 8 to 5
- Reduce body cell padding from 10 to 6
- Reduce body font from 10pt to 9pt
- Adjust column widths so "Qty", "Unit Price", and "Amount" headers don't wrap

### 4. Scope/Totals Section (`contentSections.ts`) - Compact spacing
- Reduce "Project Details" heading from 12pt to 10pt
- Reduce checkmark item font from 9pt to 8pt
- Reduce line height between items
- Reduce scope box width from 58% to 55%

### 5. Totals Box (`pricingSection.ts`) - Slightly smaller
- Reduce box height from 46mm to 40mm
- Tighten internal spacing

### 6. Notes Section (`contentSections.ts`) - More compact
- Reduce heading from 12pt to 10pt
- Reduce vertical padding

### 7. Orchestrator (`ProposalPdfGenerator.tsx`) - Adjust spacing gaps
- Reduce gaps between sections

## Files to Modify (5 files)

| File | Changes |
|------|---------|
| `headerSection.ts` | Reduce header height, logo size, font sizes |
| `clientSection.ts` | Reduce section height, title size, meta card spacing |
| `pricingSection.ts` | Reduce table padding, fix column widths, smaller totals box |
| `contentSections.ts` | Reduce scope box font sizes and line spacing, compact notes |
| `ProposalPdfGenerator.tsx` | Reduce inter-section gaps |

## Expected Result
The proposal should fit on **1 page** for typical proposals (1-3 items), matching the clean, compact layout from the HTML template. Everything should look proportional and professional without text wrapping in table cells.

