
import { jsPDF } from "jspdf";
import { parseProposalContent } from "../formatters";

export const addContentSections = (
  doc: jsPDF,
  content: string,
  margin: number,
  contentWidth: number,
  startY: number
) => {
  let yPosition = startY;
  let sections = parseProposalContent(content);

  // Add each section with proper spacing and page breaks
  Object.entries(sections).forEach(([title, content]) => {
    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yPosition = 20;
    }

    // Add section title
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(title, margin, yPosition);
    yPosition += 7;

    // Add section content - use placeholder text if empty
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    // Check if content is empty and provide a placeholder
    const textToDisplay = content && content.trim() ? content : `No ${title.toLowerCase()} information provided`;
    
    const lines = doc.splitTextToSize(textToDisplay, contentWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * 5 + 10; // Add extra spacing between sections
  });

  return yPosition;
};
