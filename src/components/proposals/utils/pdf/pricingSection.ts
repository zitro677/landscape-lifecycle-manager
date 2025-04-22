
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
  const tax = subtotal * 0.07; // Corrected to 7%
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
