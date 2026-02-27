
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Invoice } from "./types";
import { toast } from "sonner";
import { format } from "date-fns";
import { addHeaderSection } from "../proposals/utils/pdf/headerSection";
import { addServicesTable, addTotalsBox } from "../proposals/utils/pdf/pricingSection";
import { addNotesSection } from "../proposals/utils/pdf/contentSections";
import { formatDate } from "../proposals/utils/formatters";

interface InvoicePdfGeneratorProps {
  invoice: Invoice;
}

const addInvoiceInfoSection = (
  doc: jsPDF,
  invoice: Invoice,
  startY: number,
  margin: number
) => {
  const pageWidth = doc.internal.pageSize.width;
  const sectionHeight = 46;

  // Cream background band
  doc.setFillColor(248, 250, 249);
  doc.setDrawColor(216, 243, 220);
  doc.rect(0, startY, pageWidth, sectionHeight, "FD");

  // Left side
  const leftX = margin;
  let leftY = startY + 10;

  // "OFFICIAL INVOICE" label
  doc.setFontSize(7);
  doc.setFont(undefined!, "bold");
  doc.setTextColor(82, 183, 136);
  doc.text("OFFICIAL INVOICE", leftX, leftY);

  // Invoice number as title
  leftY += 9;
  doc.setFontSize(16);
  doc.setFont(undefined!, "bold");
  doc.setTextColor(27, 67, 50);
  doc.text(`Invoice #${invoice.invoice_number}`, leftX, leftY);

  // Bill To client info
  leftY += 8;
  doc.setFontSize(9);
  doc.setFont(undefined!, "normal");
  doc.setTextColor(108, 117, 125);
  doc.text(`Bill To: ${invoice.client_name || "Client"}`, leftX, leftY);
  if (invoice.clients?.address) {
    leftY += 5;
    doc.setFontSize(8);
    doc.text(invoice.clients.address, leftX, leftY);
  }
  if (invoice.clients?.email) {
    leftY += 5;
    doc.setFontSize(8);
    doc.text(invoice.clients.email, leftX, leftY);
  }

  // Right side: meta card
  const metaBoxWidth = 70;
  const metaBoxX = pageWidth - margin - metaBoxWidth;
  const metaBoxY = startY + 4;
  const metaBoxH = 38;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(216, 243, 220);
  doc.roundedRect(metaBoxX, metaBoxY, metaBoxWidth, metaBoxH, 3, 3, "FD");

  const metaRows = [
    { label: "Invoice #", value: invoice.invoice_number || "—" },
    { label: "Issue Date", value: formatDate(invoice.issue_date) },
    { label: "Due Date", value: formatDate(invoice.due_date ?? undefined) },
    { label: "Status", value: invoice.status || "Draft" },
  ];

  let metaY = metaBoxY + 8;
  const labelX = metaBoxX + 5;
  const valX = metaBoxX + metaBoxWidth - 5;

  metaRows.forEach((row, i) => {
    doc.setFontSize(6);
    doc.setFont(undefined!, "bold");
    doc.setTextColor(108, 117, 125);
    doc.text(row.label, labelX, metaY);

    if (row.label === "Status") {
      const statusText = row.value;
      doc.setFontSize(6);
      doc.setFont(undefined!, "bold");
      const textWidth = doc.getTextWidth(statusText);
      const badgeW = textWidth + 6;
      const badgeX = valX - badgeW;
      const badgeY = metaY - 3;

      // Color badge based on status
      const statusColors: Record<string, [number, number, number]> = {
        Paid: [116, 198, 157],
        Pending: [255, 193, 7],
        Overdue: [220, 53, 69],
        Draft: [173, 181, 189],
      };
      const badgeColor = statusColors[statusText] || [116, 198, 157];
      doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      doc.roundedRect(badgeX, badgeY, badgeW, 5, 1.5, 1.5, "F");
      doc.setTextColor(27, 67, 50);
      doc.text(statusText, badgeX + badgeW / 2, metaY, { align: "center" });
    } else {
      doc.setFontSize(8);
      doc.setFont(undefined!, "bold");
      doc.setTextColor(27, 67, 50);
      doc.text(row.value, valX, metaY, { align: "right" });
    }

    if (i < metaRows.length - 1) {
      metaY += 2;
      doc.setDrawColor(216, 243, 220);
      doc.setLineWidth(0.2);
      doc.line(labelX, metaY, valX, metaY);
    }
    metaY += 7;
  });

  doc.setTextColor(0, 0, 0);
  return startY + sectionHeight + 1;
};

const InvoicePdfGenerator = ({ invoice }: InvoicePdfGeneratorProps) => {
  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // 1) Header with gradient + logo
      let yPosition = await addHeaderSection(doc, "INVOICE", 0, pageWidth);

      // 2) Invoice info section (client + meta card)
      yPosition = addInvoiceInfoSection(doc, invoice, yPosition, margin);

      // 3) Build items array
      let items =
        invoice.items && invoice.items.length > 0
          ? invoice.items.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
              amount: item.amount ?? (Number(item.quantity ?? 1) * Number(item.unit_price ?? 0)),
            }))
          : [
              {
                description: "Services",
                quantity: 1,
                unit_price: Number(invoice.amount ?? 0),
                amount: Number(invoice.amount ?? 0),
              },
            ];

      // 4) Services table
      yPosition = addServicesTable(doc, margin, yPosition, contentWidth, items);

      // 5) Notes (left) + Totals box (right) side by side
      const totalsStartY = yPosition;
      addTotalsBox(doc, Number(invoice.amount ?? 0), margin, totalsStartY, pageWidth);

      // Notes section below table if present
      if (invoice.notes && invoice.notes.trim()) {
        yPosition = addNotesSection(doc, invoice.notes, margin, contentWidth, totalsStartY + 44 + 4);
      } else {
        yPosition = totalsStartY + 44 + 4;
      }

      // 6) Footer
      if (yPosition > doc.internal.pageSize.height - 25) {
        doc.addPage();
      }
      doc.setFontSize(8);
      doc.setTextColor(108, 117, 125);
      doc.text(
        "Thank you for choosing Green Landscape Irrigation for your project.",
        pageWidth / 2,
        yPosition + 3,
        { align: "center" }
      );

      // Page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(160, 160, 160);
        doc.text(
          `Generated on ${format(new Date(), "MMM dd, yyyy")}  •  Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 8,
          { align: "center" }
        );
      }
      doc.setTextColor(0, 0, 0);

      doc.save(`Invoice_${invoice.invoice_number}.pdf`);
      toast.success("Invoice PDF downloaded successfully");
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate invoice PDF");
      return null;
    }
  };

  return { generatePDF };
};

export default InvoicePdfGenerator;
