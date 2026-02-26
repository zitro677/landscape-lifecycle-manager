
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { formatCurrency } from "../formatters";

export const addServicesTable = (
  doc: jsPDF,
  margin: number,
  yPosition: number,
  contentWidth: number,
  items?: { description: string; quantity?: number | null; unit_price?: number | null; amount?: number | null }[]
) => {
  // Section header
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(27, 67, 50);
  doc.text("Scope of Services", margin, yPosition);
  yPosition += 4;
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(108, 117, 125);
  doc.text("Detailed breakdown of work to be completed", margin, yPosition);
  yPosition += 6;

  const tableItems = items && items.length > 0
    ? items
    : [{ description: "No services listed", quantity: 0, unit_price: 0, amount: 0 }];

  autoTable(doc, {
    startY: yPosition,
    head: [['Description', 'Qty', 'Unit Price', 'Amount']],
    body: tableItems.map((item: any) => [
      item.description || "Service",
      String(item.quantity ?? 1),
      formatCurrency(item.unit_price ?? 0),
      formatCurrency(item.amount ?? (item.quantity ?? 1) * (item.unit_price ?? 0)),
    ]),
    margin: { left: margin, right: margin },
    theme: 'plain',
    headStyles: {
      fillColor: [45, 106, 79],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 5,
      textColor: [27, 67, 50],
    },
    alternateRowStyles: { fillColor: [248, 250, 249] },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.52, fontStyle: 'bold' },
      1: { cellWidth: contentWidth * 0.10, halign: 'center', fontStyle: 'bold', textColor: [45, 106, 79] },
      2: { cellWidth: contentWidth * 0.19, halign: 'right' },
      3: { cellWidth: contentWidth * 0.19, halign: 'right', fontStyle: 'bold' },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 6;
  doc.setTextColor(0, 0, 0);
  return yPosition;
};

export const addTotalsBox = (
  doc: jsPDF,
  amount: number,
  margin: number,
  yPosition: number,
  pageWidth: number
) => {
  const subtotal = amount;
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const boxWidth = 72;
  const boxX = pageWidth - margin - boxWidth;
  const boxHeight = 38;

  // Dark green gradient box
  doc.setFillColor(27, 67, 50);
  doc.roundedRect(boxX, yPosition, boxWidth, boxHeight, 3, 3, 'F');

  // Subtotal
  let y = yPosition + 10;
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(200, 230, 210);
  doc.text("Subtotal", boxX + 8, y);
  doc.text(formatCurrency(subtotal), boxX + boxWidth - 8, y, { align: "right" });

  // Tax
  y += 7;
  doc.text("Tax (7%)", boxX + 8, y);
  doc.text(formatCurrency(tax), boxX + boxWidth - 8, y, { align: "right" });

  // Divider
  y += 4;
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.2);
  doc.line(boxX + 8, y, boxX + boxWidth - 8, y);

  // Total
  y += 8;
  doc.setFontSize(7);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(116, 198, 157);
  doc.text("Total Investment", boxX + 8, y);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(formatCurrency(total), boxX + boxWidth - 8, y, { align: "right" });

  doc.setTextColor(0, 0, 0);
  return yPosition + boxHeight + 6;
};

// Backward-compatible wrapper
export const addPricingSummarySection = (
  doc: jsPDF,
  amount: number,
  margin: number,
  yPosition: number,
  pageWidth: number,
  contentWidth: number,
  items?: { description: string; quantity?: number | null; unit_price?: number | null; amount?: number | null }[]
) => {
  yPosition = addServicesTable(doc, margin, yPosition, contentWidth, items);
  yPosition = addTotalsBox(doc, amount, margin, yPosition, pageWidth);
  return yPosition;
};
