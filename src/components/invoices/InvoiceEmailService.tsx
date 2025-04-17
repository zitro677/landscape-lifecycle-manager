
import { Invoice } from "./types";
import { formatCurrency } from "./utils";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

interface InvoiceEmailServiceProps {
  invoice: Invoice;
}

const InvoiceEmailService = ({ invoice }: InvoiceEmailServiceProps) => {
  const createPdf = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add company information
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text("Green Landscape Irrigation", 20, 20);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text("Phone: (727) 484-5516", 20, 28);
      doc.text("Email: greenplanetlandscaping01@gmail.com", 20, 34);
      doc.text("Web: www.greenlandscapeirrigation.com", 20, 40);
      
      // Add title
      doc.setFontSize(20);
      doc.text("INVOICE", 105, 50, { align: "center" });
      
      // Add invoice number
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoice.invoice_number}`, 20, 60);
      
      // Add status
      const statusText = `Status: ${invoice.status}`;
      doc.text(statusText, 190, 60, { align: "right" });
      
      // Add client information
      doc.setFontSize(12);
      doc.text("Client Information:", 20, 75);
      doc.setFontSize(10);
      doc.text(`To: ${invoice.client_name || "Client"}`, 20, 82);
      doc.text(`Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, 20, 88);
      doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 20, 94);
      
      // Prepare table data for invoice items
      const headers = [["Description", "Quantity", "Unit Price", "Amount"]];
      let data = [];
      
      // Check if invoice has items and add them to the table
      if (invoice.items && invoice.items.length > 0) {
        data = invoice.items.map(item => [
          item.description,
          item.quantity.toString(),
          formatCurrency(Number(item.unit_price)),
          formatCurrency(Number(item.quantity) * Number(item.unit_price))
        ]);
      } else {
        // If no items, just show the total amount as a single row
        data = [["Services", "1", formatCurrency(Number(invoice.amount)), formatCurrency(Number(invoice.amount))]];
      }
      
      // @ts-ignore - jspdf-autotable types are not included in the TS definition
      doc.autoTable({
        startY: 105,
        head: headers,
        body: data,
        theme: 'grid',
        styles: { fontSize: 10 },
      });
      
      // Add total
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Subtotal: ${formatCurrency(Number(invoice.amount))}`, 190, finalY, { align: "right" });
      
      // Add tax if applicable
      let currentY = finalY + 6;
      if (invoice.tax_rate && Number(invoice.tax_rate) > 0) {
        const taxAmount = Number(invoice.amount) * (Number(invoice.tax_rate) / 100);
        doc.text(`Tax (${invoice.tax_rate}%): ${formatCurrency(taxAmount)}`, 190, currentY, { align: "right" });
        currentY += 6;
        doc.text(`Total: ${formatCurrency(Number(invoice.amount) + taxAmount)}`, 190, currentY, { align: "right" });
      } else {
        doc.text(`Total: ${formatCurrency(Number(invoice.amount))}`, 190, currentY, { align: "right" });
      }
      
      // Add notes
      if (invoice.notes) {
        doc.text("Notes:", 20, currentY + 15);
        doc.text(invoice.notes || 'No additional notes', 20, currentY + 22);
      }
      
      return doc;
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast.error("Failed to create invoice PDF");
      return null;
    }
  };

  const sendEmail = () => {
    try {
      // Create email content
      const subject = `Invoice ${invoice.invoice_number}`;
      const body = `Dear ${invoice.client_name},\n\nPlease find attached invoice ${invoice.invoice_number} for ${formatCurrency(Number(invoice.amount))}.\n\nDue date: ${new Date(invoice.due_date).toLocaleDateString()}\n\nThank you for your business.\n\nRegards,\nYour Company`;
      
      // Create and download the PDF
      const doc = createPdf();
      if (doc) {
        doc.save(`Invoice_${invoice.invoice_number}.pdf`);
      }
      
      // Guide the user
      toast.success(
        "PDF invoice has been downloaded. Please attach it to your email manually.", 
        { duration: 5000 }
      );
      
      // Open default email client
      window.location.href = `mailto:${invoice.clients?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch (err) {
      console.error("Error in sendEmail:", err);
      toast.error("Failed to prepare email");
    }
  };

  return { sendEmail };
};

export default InvoiceEmailService;
