
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { formatCurrency } from "../formatters";

export const addPricingSummarySection = (
  doc: jsPDF,
  amount: number,
  margin: number,
  yPosition: number,
  pageWidth: number,
  contentWidth: number,
  items?: { description: string; quantity?: number | null; unit_price?: number | null; amount?: number | null }[]
) => {
  // Section header
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(27, 67, 50);
  doc.text("Scope of Services", margin, yPosition);
  yPosition += 3;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(108, 117, 125);
  doc.text("Detailed breakdown of work to be completed", margin, yPosition);
  yPosition += 6;

  // Services table
  const tableItems = items && items.length > 0
    ? items
    : [{ description: "No services listed", quantity: 0, unit_price: 0, amount: 0 }];

  autoTable(doc, {
    startY: yPosition,
    head: [['Description', 'Qty', 'Unit Price', 'Amount']],
    body: tableItems.map((item: any) => [
      item.description,
      String(item.quantity ?? 1),
      formatCurrency(item.unit_price ?? 0),
      formatCurrency(item.amount ?? (item.quantity ?? 1) * (item.unit_price ?? 0)),
    ]),
    margin: { left: margin, right: margin },
    theme: 'plain',
    headStyles: {
      fillColor: [45, 106, 79], // --primary
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 6,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 7,
      textColor: [27, 67, 50],
    },
    alternateRowStyles: { fillColor: [248, 250, 249] },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.52 },
      1: { cellWidth: 18, halign: 'center', fontStyle: 'bold', textColor: [45, 106, 79] },
      2: { cellWidth: contentWidth * 0.18, halign: 'right' },
      3: { cellWidth: contentWidth * 0.18, halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      // Round top-left and top-right corners via first row styling
      if (data.section === 'head' && data.column.index === 0) {
        data.cell.styles.cellPadding = { top: 6, right: 6, bottom: 6, left: 8 };
      }
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Totals box - dark green gradient style matching the HTML
  const subtotal = amount;
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const boxWidth = 78;
  const boxX = pageWidth - margin - boxWidth;
  const boxHeight = 42;

  // Dark green background
  doc.setFillColor(27, 67, 50);
  doc.roundedRect(boxX, yPosition, boxWidth, boxHeight, 3, 3, 'F');

  // Subtotal row
  let y = yPosition + 12;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(200, 230, 210);
  doc.text("Subtotal", boxX + 8, y);
  doc.text(formatCurrency(subtotal), boxX + boxWidth - 8, y, { align: "right" });

  // Tax row
  y += 8;
  doc.text("Tax (7%)", boxX + 8, y);
  doc.text(formatCurrency(tax), boxX + boxWidth - 8, y, { align: "right" });

  // Divider line
  y += 4;
  doc.setDrawColor(255, 255, 255, 50);
  doc.setLineWidth(0.3);
  doc.line(boxX + 8, y, boxX + boxWidth - 8, y);

  // Total row
  y += 9;
  doc.setFontSize(7);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(116, 198, 157); // --accent-light
  doc.text("Total Investment", boxX + 8, y);
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(formatCurrency(total), boxX + boxWidth - 8, y, { align: "right" });

  doc.setTextColor(0, 0, 0);
  return yPosition + boxHeight + 10;
};
