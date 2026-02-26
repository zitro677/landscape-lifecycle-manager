
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

  // Scope section with accent left border
  if (data.scope && data.scope.trim()) {
    if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = 20; }

    const scopeLines = doc.splitTextToSize(data.scope.trim(), contentWidth - 14);
    const boxH = Math.max(scopeLines.length * 5 + 20, 30);

    doc.setFillColor(248, 250, 249);
    doc.roundedRect(margin, yPosition, contentWidth, boxH, 3, 3, 'F');

    doc.setFillColor(82, 183, 136);
    doc.rect(margin, yPosition, 3, boxH, 'F');

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(27, 67, 50);
    doc.text("Project Details", margin + 10, yPosition + 8);

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60, 60, 60);
    let bulletY = yPosition + 16;
    const lines = data.scope.trim().split('\n').filter(l => l.trim());
    lines.forEach(line => {
      if (bulletY > pageHeight - 20) { doc.addPage(); bulletY = 20; }
      doc.setTextColor(82, 183, 136);
      doc.setFont(undefined, 'bold');
      doc.text("✓", margin + 8, bulletY);
      doc.setTextColor(60, 60, 60);
      doc.setFont(undefined, 'normal');
      const wrappedLine = doc.splitTextToSize(line.trim(), contentWidth - 20);
      doc.text(wrappedLine, margin + 14, bulletY);
      bulletY += wrappedLine.length * 5 + 2;
    });

    yPosition += boxH + 6;
  }

  // Timeline
  if (data.timeline && data.timeline.trim()) {
    if (yPosition > pageHeight - 40) { doc.addPage(); yPosition = 20; }

    doc.setFontSize(9);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(108, 117, 125);
    const timelineText = `Estimated Timeline: ${data.timeline.trim()}`;
    const tLines = doc.splitTextToSize(timelineText, contentWidth - 4);
    doc.text(tLines, margin + 4, yPosition);
    yPosition += tLines.length * 5 + 8;
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

  if (notes && notes.trim()) {
    if (yPosition > pageHeight - 60) { doc.addPage(); yPosition = 20; }

    doc.setFillColor(248, 250, 249);
    doc.setDrawColor(216, 243, 220);

    const notesLines = doc.splitTextToSize(notes.trim(), contentWidth - 10);
    const notesH = notesLines.length * 5 + 18;

    doc.rect(0, yPosition - 4, doc.internal.pageSize.width, notesH + 4, 'FD');

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(27, 67, 50);
    doc.text("Terms & Conditions", margin, yPosition + 6);

    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(108, 117, 125);
    doc.text(notesLines, margin, yPosition + 14);

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
