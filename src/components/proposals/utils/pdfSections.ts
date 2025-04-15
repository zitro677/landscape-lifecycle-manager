
import { jsPDF } from "jspdf";
import { Proposal } from "../types";
import { formatCurrency, formatDate } from "./formatters";

export const addHeaderSection = (doc: jsPDF, title: string, yPosition: number, pageWidth: number) => {
  doc.setFontSize(20);
  doc.text(title, pageWidth / 2, yPosition, { align: "center" });
  return yPosition + 10;
};

export const addClientInformationSection = (
  doc: jsPDF, 
  proposal: Proposal, 
  startY: number,
  margin: number
) => {
  let yPosition = startY;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Client Information:", margin + 5, yPosition);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  yPosition += 7;
  doc.text(`${proposal.client_name || "Client"}`, margin + 5, yPosition);
  yPosition += 5;
  if (proposal.clients?.email) {
    doc.text(`${proposal.clients.email}`, margin + 5, yPosition);
    yPosition += 5;
  }
  if (proposal.clients?.address) {
    doc.text(`${proposal.clients.address}`, margin + 5, yPosition);
  }
  return yPosition;
};

export const addProposalDetailsSection = (
  doc: jsPDF,
  proposal: Proposal,
  startY: number,
  pageWidth: number
) => {
  let rightColumn = pageWidth / 2;
  let rightYPosition = startY - 17;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Proposal Details:", rightColumn, rightYPosition);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  rightYPosition += 7;
  doc.text(`Issue Date: ${formatDate(proposal.issue_date)}`, rightColumn, rightYPosition);
  rightYPosition += 5;
  doc.text(`Valid Until: ${formatDate(proposal.valid_until)}`, rightColumn, rightYPosition);
  rightYPosition += 5;
  doc.text(`Status: ${proposal.status || "Draft"}`, rightColumn, rightYPosition);
  return rightYPosition;
};

export const addPricingSummarySection = (
  doc: jsPDF,
  amount: number,
  margin: number,
  yPosition: number,
  pageWidth: number,
  contentWidth: number
) => {
  const subtotal = amount;
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPosition, contentWidth, 30, 'FD');
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Total Amount:", margin + 5, yPosition);
  doc.text(formatCurrency(total), pageWidth - margin - 5, yPosition, { align: "right" });
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Subtotal: ${formatCurrency(subtotal)}`, margin + 5, yPosition);
  doc.text(`Tax (7%): ${formatCurrency(tax)}`, pageWidth - margin - 5, yPosition, { align: "right" });

  return yPosition + 25;
};

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
