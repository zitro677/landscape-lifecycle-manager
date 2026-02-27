

# Improve Header Gradient in Proposal PDF

## Current State
The header uses a simple two-block approach: a dark green rectangle covering the full width, then a lighter green rectangle overlapping the right 45%. This creates a hard edge at the 55% mark rather than a smooth gradient.

## Proposed Change

**File: `src/components/proposals/utils/pdf/headerSection.ts`**

Replace the current two-rectangle approach with a multi-strip gradient that smoothly transitions from dark green (#1B4332) to medium green (#2D6A4F) to accent green (#40916C) across the header width. Since jsPDF doesn't support native gradients, we simulate it by drawing ~20 thin vertical strips, each with an interpolated color between the start and end values. This produces a visually smooth gradient effect matching the HTML template's `linear-gradient(135deg, #1b4332, #2d6a4f)`.

### Technical Details
- Draw 20 vertical strips across the header width
- Interpolate RGB values from (27, 67, 50) on the left to (45, 106, 79) in the middle to (64, 145, 108) on the right
- Remove the current hard-edged two-rectangle approach
- No other files need changes
