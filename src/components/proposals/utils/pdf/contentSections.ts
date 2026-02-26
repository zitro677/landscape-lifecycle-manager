
import { jsPDF } from "jspdf";

interface ContentSectionsData {
  scope?: string | null;
  timeline?: string | null;
  notes?: string | null;
}

export const addScopeAndTimeline = (
  doc: jsPDF,
  data: { scope?: string | null; timeline?: string | null },
  margin: number,
  contentWidth: number,
  startY: number
) => {
  let yPosition = startY;
  const pageHeight = doc.internal.pageSize.height;

  if (data.scope && data.scope.trim()) {
    if (yPosition > pageHeight - 50) { doc.addPage(); yPosition = 20; }

    const lines = data.scope.trim().split('\n').filter(l => l.trim());
    let totalLineHeight = 0;
    lines.forEach(line => {
      const wrapped = doc.splitTextToSize(line.trim(), contentWidth * 0.50 - 20);
      totalLineHeight += wrapped.length * 4 + 2;
    });

    const timelineExtra = (data.timeline && data.timeline.trim()) ? 14 : 0;
    const boxH = Math.max(totalLineHeight + 22 + timelineExtra, 30);

    // Background box with left accent border
    doc.setFillColor(248, 250, 249);
    doc.roundedRect(margin, yPosition, contentWidth * 0.55, boxH, 3, 3, 'F');
    doc.setFillColor(82, 183, 136);
    doc.rect(margin, yPosition, 2.5, boxH, 'F');

    // "Project Details" heading
    let innerY = yPosition + 9;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(27, 67, 50);
    doc.text("Project Details", margin + 10, innerY);

    // Scope items with checkmarks
    innerY += 7;
    lines.forEach(line => {
      if (innerY > pageHeight - 15) { doc.addPage(); innerY = 20; }
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(82, 183, 136);
      doc.text("✓", margin + 8, innerY);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(27, 67, 50);
      const wrappedLine = doc.splitTextToSize(line.trim(), contentWidth * 0.50 - 24);
      doc.text(wrappedLine, margin + 15, innerY);
      innerY += wrappedLine.length * 4 + 2;
    });

    // Timeline inside the scope box
    if (data.timeline && data.timeline.trim()) {
      innerY += 3;
      doc.setDrawColor(216, 243, 220);
      doc.setLineWidth(0.2);
      doc.line(margin + 8, innerY, margin + contentWidth * 0.50 - 8, innerY);
      innerY += 6;
      doc.setFontSize(8);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(108, 117, 125);
      doc.text(`Estimated Timeline: ${data.timeline.trim()}`, margin + 8, innerY);
    }

    yPosition += boxH + 4;
  } else if (data.timeline && data.timeline.trim()) {
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(108, 117, 125);
    doc.text(`Estimated Timeline: ${data.timeline.trim()}`, margin, yPosition);
    yPosition += 10;
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
    if (yPosition > pageHeight - 40) { doc.addPage(); yPosition = 20; }

    // Cream background band
    doc.setFillColor(248, 250, 249);
    doc.setDrawColor(216, 243, 220);
    const notesLines = doc.splitTextToSize(notes.trim(), contentWidth - 10);
    const notesH = notesLines.length * 4 + 18;
    doc.rect(0, yPosition - 2, pageWidth, notesH + 2, 'FD');

    // "Terms & Conditions" heading
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(27, 67, 50);
    doc.text("Terms & Conditions", pageWidth / 2, yPosition + 6, { align: "center" });

    // Notes text centered
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(108, 117, 125);
    doc.text(notesLines, pageWidth / 2, yPosition + 14, { align: "center" });

    yPosition += notesH + 4;
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
