
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
      
      // Add title
      doc.setFontSize(20);
      doc.text("INVOICE", 105, 20, { align: "center" });
      
      // Add invoice number
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoice.invoice_number}`, 20, 30);
      
      // Add status
      const statusText = `Status: ${invoice.status}`;
      doc.text(statusText, 190, 30, { align: "right" });
      
      // Add client information
      doc.setFontSize(12);
      doc.text("Client Information:", 20, 45);
      doc.setFontSize(10);
      doc.text(`To: ${invoice.client_name || "Client"}`, 20, 52);
      doc.text(`Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, 20, 58);
      doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 20, 64);
      
      // Add table header
      const headers = [["Description", "Amount"]];
      const data = [["Services", formatCurrency(Number(invoice.amount))]];
      
      // @ts-ignore - jspdf-autotable types are not included in the TS definition
      doc.autoTable({
        startY: 75,
        head: headers,
        body: data,
        theme: 'grid',
        styles: { fontSize: 10 },
      });
      
      // Add total
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Total: ${formatCurrency(Number(invoice.amount))}`, 190, finalY, { align: "right" });
      
      // Add notes
      if (invoice.notes) {
        doc.text("Notes:", 20, finalY + 15);
        doc.text(invoice.notes || 'No additional notes', 20, finalY + 22);
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
