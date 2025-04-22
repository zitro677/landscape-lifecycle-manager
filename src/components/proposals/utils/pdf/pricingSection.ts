
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
  doc.setDrawColor(120, 120, 120);  // Changed from green to a neutral gray
  doc.setFillColor(240, 240, 240);  // Changed from soft green to light gray
  doc.roundedRect(margin, yPosition, contentWidth, 40, 4, 4, 'FD');
  
  // Title
  yPosition += 8;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(80, 80, 80);  // Changed from green to a dark gray
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

  // Decorative line separator with more emphasis
  yPosition += 6;
  doc.setLineWidth(0.5);
  doc.setDrawColor(93, 144, 73);
  doc.line(margin + 5, yPosition, pageWidth - margin - 5, yPosition);

  // Total with enhanced styling
  yPosition += 10;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(47, 86, 37);
  
  // Add a subtle box around the total
  doc.setDrawColor(93, 144, 73);
  doc.setLineWidth(0.3);
  doc.rect(margin + 5, yPosition - 5, contentWidth - 10, 15, 'S');
  
  doc.text("Total Amount:", margin + 8, yPosition);
  doc.text(formatCurrency(total), pageWidth - margin - 8, yPosition, { align: "right" });

  doc.setTextColor(0, 0, 0);

  return yPosition + 18;
};

