
import { jsPDF } from "jspdf";

export const addContentSections = (
  doc: jsPDF,
  content: string,
  margin: number,
  contentWidth: number,
  startY: number
) => {
  let yPosition = startY;
  let sections = parseContent(content);

  // Add each section with proper spacing and page breaks
  Object.entries(sections).forEach(([title, content]) => {
    if (content) {
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

      // Add section content
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(content, contentWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 10; // Add extra spacing between sections
    }
  });

  return yPosition;
};

const parseContent = (content: string) => {
  const sections: Record<string, string> = {
    "Project Scope": "",
    "Project Timeline": "",
    "Items & Services": "",
    "Terms & Notes": ""
  };

  if (!content) return sections;

  // Parse content into sections based on form field structure
  // This matches how the data is structured in ProposalForm.tsx
  const scopePattern = /(.*?)(Timeline:|$)/s;
  const timelinePattern = /Timeline:(.*?)(Items:|$)/s;
  const itemsPattern = /Items:(.*?)(Notes:|$)/s;
  const notesPattern = /Notes:(.*?)$/s;

  // Extract Project Scope
  const scopeMatch = content.match(scopePattern);
  if (scopeMatch && scopeMatch[1]) {
    sections["Project Scope"] = scopeMatch[1].trim();
  } else {
    sections["Project Scope"] = content.trim(); // Default all content to scope if no markers
  }

  // Extract Timeline
  const timelineMatch = content.match(timelinePattern);
  if (timelineMatch && timelineMatch[1]) {
    sections["Project Timeline"] = timelineMatch[1].trim();
  }

  // Extract Items
  const itemsMatch = content.match(itemsPattern);
  if (itemsMatch && itemsMatch[1]) {
    sections["Items & Services"] = itemsMatch[1].trim();
  }

  // Extract Notes
  const notesMatch = content.match(notesPattern);
  if (notesMatch && notesMatch[1]) {
    sections["Terms & Notes"] = notesMatch[1].trim();
  }

  return sections;
};
