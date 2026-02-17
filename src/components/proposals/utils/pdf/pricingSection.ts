
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
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
  // Items table
  if (items && items.length > 0) {
    yPosition += 4;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text("Items & Services", margin + 6, yPosition);
    yPosition += 4;

    (doc as any).autoTable({
      startY: yPosition,
      head: [['Description', 'Qty', 'Unit Price', 'Amount']],
      body: items.map(item => [
        item.description,
        String(item.quantity ?? 1),
        formatCurrency(item.unit_price ?? 0),
        formatCurrency(item.amount ?? (item.quantity ?? 1) * (item.unit_price ?? 0)),
      ]),
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: { fillColor: [93, 144, 73], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: contentWidth * 0.5 },
        1: { cellWidth: contentWidth * 0.1, halign: 'center' },
        2: { cellWidth: contentWidth * 0.2, halign: 'right' },
        3: { cellWidth: contentWidth * 0.2, halign: 'right' },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 8;
  }

  // Pricing Summary
  const subtotal = amount;
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  yPosition += 8;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text("Pricing Summary", margin + 6, yPosition);

  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);

  yPosition += 9;
  doc.text("Subtotal:", margin + 8, yPosition);
  doc.text(formatCurrency(subtotal), pageWidth - margin - 8, yPosition, { align: "right" });

  yPosition += 7;
  doc.text("Tax (7%):", margin + 8, yPosition);
  doc.text(formatCurrency(tax), pageWidth - margin - 8, yPosition, { align: "right" });

  yPosition += 6;
  doc.setLineWidth(0.5);
  doc.setDrawColor(93, 144, 73);
  doc.line(margin + 5, yPosition, pageWidth - margin - 5, yPosition);

  yPosition += 10;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(47, 86, 37);

  doc.text("Total Amount:", margin + 8, yPosition);
  doc.text(formatCurrency(total), pageWidth - margin - 8, yPosition, { align: "right" });

  doc.setTextColor(0, 0, 0);

  return yPosition + 18;
};
