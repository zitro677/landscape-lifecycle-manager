
import { jsPDF } from "jspdf";

interface ContentSectionsData {
  scope?: string | null;
  timeline?: string | null;
  notes?: string | null;
}

/**
 * Adds Scope (Project Details) with checkmark bullets + Timeline.
 * This renders on the LEFT side conceptually, but in PDF we render full-width
 * since PDF doesn't support side-by-side grid easily.
 * The totals box is placed by the orchestrator after this.
 */
export const addScopeAndTimeline = (
  doc: jsPDF,
  data: { scope?: string | null; timeline?: string | null },
  margin: number,
  contentWidth: number,
  startY: number
) => {
  let yPosition = startY;
  const pageHeight = doc.internal.pageSize.height;

  // Only render scope box if there's content
  if (data.scope && data.scope.trim()) {
    if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = 20; }

    const lines = data.scope.trim().split('\n').filter(l => l.trim());
    // Calculate box height
    let totalLineHeight = 0;
    lines.forEach(line => {
      const wrapped = doc.splitTextToSize(line.trim(), contentWidth * 0.55 - 24);
      totalLineHeight += wrapped.length * 5 + 3;
    });

    const timelineExtra = (data.timeline && data.timeline.trim()) ? 18 : 0;
    const boxH = Math.max(totalLineHeight + 28 + timelineExtra, 40);

    // Background box with left accent border
    doc.setFillColor(248, 250, 249);
    doc.roundedRect(margin, yPosition, contentWidth * 0.58, boxH, 4, 4, 'F');
    // Accent left border
    doc.setFillColor(82, 183, 136);
    doc.rect(margin, yPosition, 3, boxH, 'F');

    // "Project Details" heading
    let innerY = yPosition + 12;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(27, 67, 50);
    doc.text("Project Details", margin + 12, innerY);

    // Scope items with checkmarks
    innerY += 10;
    lines.forEach(line => {
      if (innerY > pageHeight - 20) { doc.addPage(); innerY = 20; }
      // Checkmark
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(82, 183, 136);
      doc.text("✓", margin + 10, innerY);
      // Text
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(27, 67, 50);
      const wrappedLine = doc.splitTextToSize(line.trim(), contentWidth * 0.55 - 28);
      doc.text(wrappedLine, margin + 18, innerY);
      innerY += wrappedLine.length * 5 + 3;
    });

    // Timeline inside the scope box
    if (data.timeline && data.timeline.trim()) {
      innerY += 4;
      doc.setDrawColor(216, 243, 220);
      doc.setLineWidth(0.3);
      doc.line(margin + 10, innerY, margin + contentWidth * 0.55 - 10, innerY);
      innerY += 8;
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(108, 117, 125);
      doc.text(`Estimated Timeline: ${data.timeline.trim()}`, margin + 10, innerY);
    }

    yPosition += boxH + 6;
  } else if (data.timeline && data.timeline.trim()) {
    // Timeline only, no scope
    doc.setFontSize(9);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(108, 117, 125);
    doc.text(`Estimated Timeline: ${data.timeline.trim()}`, margin, yPosition);
    yPosition += 12;
  }

  doc.setTextColor(0, 0, 0);
  return yPosition;
};

export const addNotesSection = (
  doc: jsPDF,
  notes: string | null | undefined,
  margin: number,
  contentWidth: number,
  startY: number
) => {
  let yPosition = startY;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  if (notes && notes.trim()) {
    if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = 20; }

    // Cream background band (full width)
    doc.setFillColor(248, 250, 249);
    doc.setDrawColor(216, 243, 220);
    const notesLines = doc.splitTextToSize(notes.trim(), contentWidth - 10);
    const notesH = notesLines.length * 5 + 26;
    doc.rect(0, yPosition - 4, pageWidth, notesH + 4, 'FD');

    // "Terms & Conditions" heading
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(27, 67, 50);
    doc.text("Terms & Conditions", pageWidth / 2, yPosition + 8, { align: "center" });

    // Notes text centered
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(108, 117, 125);
    // Center the text block
    doc.text(notesLines, pageWidth / 2, yPosition + 18, { align: "center" });

    yPosition += notesH + 6;
  }

  doc.setTextColor(0, 0, 0);
  return yPosition;
};

// Backward-compatible wrapper
export const addContentSections = (
  doc: jsPDF,
  data: ContentSectionsData,
  margin: number,
  contentWidth: number,
  startY: number
) => {
  let yPosition = addScopeAndTimeline(doc, data, margin, contentWidth, startY);
  yPosition = addNotesSection(doc, data.notes, margin, contentWidth, yPosition);
  return yPosition;
};
