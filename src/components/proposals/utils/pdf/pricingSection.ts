
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
  // Items table - always render
  {
    yPosition += 2;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(93, 144, 73);
    doc.text("Items & Services", margin, yPosition);
    yPosition += 4;

    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Description', 'Qty', 'Unit Price', 'Amount']],
      body: (items && items.length > 0 ? items : [{ description: "No services listed", quantity: 0, unit_price: 0, amount: 0 }]).map((item: any, i: number) => [
        String(i + 1),
        item.description,
        String(item.quantity ?? 1),
        formatCurrency(item.unit_price ?? 0),
        formatCurrency(item.amount ?? (item.quantity ?? 1) * (item.unit_price ?? 0)),
      ]),
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: {
        fillColor: [93, 144, 73],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [248, 252, 247] },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: contentWidth * 0.45 },
        2: { cellWidth: 18, halign: 'center' },
        3: { cellWidth: contentWidth * 0.18, halign: 'right' },
        4: { cellWidth: contentWidth * 0.18, halign: 'right' },
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 6;
  }

  // Totals box
  const subtotal = amount;
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  // Right-aligned totals block
  const boxWidth = 80;
  const boxX = pageWidth - margin - boxWidth;

  doc.setFillColor(248, 252, 247);
  doc.setDrawColor(200, 220, 195);
  doc.roundedRect(boxX, yPosition, boxWidth, 36, 2, 2, 'FD');

  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  const labelX = boxX + 6;
  const valX = boxX + boxWidth - 6;
  let y = yPosition + 10;

  doc.text("Subtotal:", labelX, y);
  doc.text(formatCurrency(subtotal), valX, y, { align: "right" });

  y += 8;
  doc.text("Tax (7%):", labelX, y);
  doc.text(formatCurrency(tax), valX, y, { align: "right" });

  y += 3;
  doc.setDrawColor(93, 144, 73);
  doc.setLineWidth(0.5);
  doc.line(labelX, y, valX, y);

  y += 8;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(13);
  doc.setTextColor(47, 86, 37);
  doc.text("Total:", labelX, y);
  doc.text(formatCurrency(total), valX, y, { align: "right" });

  doc.setTextColor(0, 0, 0);
  return yPosition + 44;
};
