
import { jsPDF } from "jspdf";
import { formatCurrency } from "../formatters";

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

  // Outer box with pleasant highlight
  doc.setDrawColor(93, 144, 73);
  doc.setFillColor(240, 248, 237);
  doc.roundedRect(margin, yPosition, contentWidth, 35, 4, 4, 'FD');
  // Title
  yPosition += 8;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(93, 144, 73);
  doc.text("Pricing Summary", margin + 6, yPosition);

  doc.setTextColor(0,0,0);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);

  // Subtotal and tax - left/right
  yPosition += 9;
  doc.text("Subtotal:", margin + 8, yPosition);
  doc.text(formatCurrency(subtotal), pageWidth - margin - 8, yPosition, { align: "right" });

  yPosition += 7;
  doc.text("Tax (7%):", margin + 8, yPosition);
  doc.text(formatCurrency(tax), pageWidth - margin - 8, yPosition, { align: "right" });

  // Line separator
  yPosition += 4;
  doc.setDrawColor(210, 224, 210);
  doc.line(margin + 5, yPosition, pageWidth - margin - 5, yPosition);

  // Total with emphasis
  yPosition += 8;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(47, 86, 37);
  doc.text("Total Amount:", margin + 8, yPosition);
  doc.text(formatCurrency(total), pageWidth - margin - 8, yPosition, { align: "right" });

  doc.setTextColor(0, 0, 0);

  return yPosition + 18;
};
