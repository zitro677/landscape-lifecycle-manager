
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

  // Parse content into sections
  let currentContent = content;

  // Extract Project Scope (everything before Timeline)
  if (currentContent.includes("Timeline:")) {
    const [scope, rest] = currentContent.split("Timeline:");
    sections["Project Scope"] = scope.trim();
    currentContent = rest;

    // Extract Timeline (everything before Items)
    if (currentContent.includes("Items:")) {
      const [timeline, rest] = currentContent.split("Items:");
      sections["Project Timeline"] = timeline.trim();
      currentContent = rest;

      // Extract Items and Notes
      if (currentContent.includes("Notes:")) {
        const [items, notes] = currentContent.split("Notes:");
        sections["Items & Services"] = items.trim();
        sections["Terms & Notes"] = notes.trim();
      } else {
        sections["Items & Services"] = currentContent.trim();
      }
    } else if (currentContent.includes("Notes:")) {
      // Handle case where there are no Items but there are Notes
      const [timeline, notes] = currentContent.split("Notes:");
      sections["Project Timeline"] = timeline.trim();
      sections["Terms & Notes"] = notes.trim();
    } else {
      sections["Project Timeline"] = currentContent.trim();
    }
  } else {
    // If no sections found, put everything in Project Scope
    sections["Project Scope"] = currentContent.trim();
  }

  return sections;
};

