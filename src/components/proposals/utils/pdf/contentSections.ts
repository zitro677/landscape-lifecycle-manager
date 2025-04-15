
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

  // Add each section
  Object.entries(sections).forEach(([title, content]) => {
    if (content) {
      if (yPosition > doc.internal.pageSize.height - 60) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(title, margin, yPosition);
      yPosition += 7;
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(content, contentWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 10;
    }
  });

  return yPosition;
};

const parseContent = (content: string) => {
  const sections: Record<string, string> = {
    "Project Scope": content
  };

  if (content.includes("Timeline:")) {
    const parts = content.split("Timeline:");
    sections["Project Scope"] = parts[0].trim();
    const remainingContent = parts[1];
    
    if (remainingContent.includes("Items:")) {
      const timelineParts = remainingContent.split("Items:");
      sections["Project Timeline"] = timelineParts[0].trim();
      const afterTimelineContent = timelineParts[1];
      
      if (afterTimelineContent.includes("Notes:")) {
        const itemsParts = afterTimelineContent.split("Notes:");
        sections["Items & Services"] = itemsParts[0].trim();
        sections["Terms & Notes"] = itemsParts[1].trim();
      } else {
        sections["Items & Services"] = afterTimelineContent.trim();
      }
    } else if (remainingContent.includes("Notes:")) {
      const timelineParts = remainingContent.split("Notes:");
      sections["Project Timeline"] = timelineParts[0].trim();
      sections["Terms & Notes"] = timelineParts[1].trim();
    } else {
      sections["Project Timeline"] = remainingContent.trim();
    }
  }

  return sections;
};
