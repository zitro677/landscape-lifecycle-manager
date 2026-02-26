
import { jsPDF } from "jspdf";

interface ContentSectionsData {
  scope?: string | null;
  timeline?: string | null;
  notes?: string | null;
}

export const addContentSections = (
  doc: jsPDF,
  data: ContentSectionsData,
  margin: number,
  contentWidth: number,
  startY: number
) => {
  let yPosition = startY;

  const sections: { title: string; content: string | null | undefined }[] = [
    { title: "Project Scope", content: data.scope },
    { title: "Project Timeline", content: data.timeline },
    { title: "Terms & Notes", content: data.notes },
  ];

  sections.forEach(({ title, content }) => {
    if (!content || !content.trim()) return;

    if (yPosition > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yPosition = 20;
    }

    // Section header
    doc.setFillColor(245, 249, 244);
    doc.roundedRect(margin, yPosition, contentWidth, 10, 2, 2, "F");
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(93, 144, 73);
    doc.text(title, margin + 4, yPosition + 7);
    yPosition += 14;

    // Section body
    doc.setTextColor(60, 60, 60);
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(content.trim(), contentWidth - 2);
    doc.text(lines, margin + 2, yPosition);
    yPosition += lines.length * 5 + 8;
  });

  doc.setTextColor(0, 0, 0);
  return yPosition;
};
