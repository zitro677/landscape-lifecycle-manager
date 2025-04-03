
import { Invoice } from "./types";
import { formatCurrency } from "./utils";
import { toast } from "sonner";

interface InvoiceEmailServiceProps {
  invoice: Invoice;
}

const InvoiceEmailService = ({ invoice }: InvoiceEmailServiceProps) => {
  const sendEmail = () => {
    // Create email content
    const subject = `Invoice ${invoice.invoice_number}`;
    const body = `Dear ${invoice.client_name},\n\nPlease find attached invoice ${invoice.invoice_number} for ${formatCurrency(Number(invoice.amount))}.\n\nDue date: ${new Date(invoice.due_date).toLocaleDateString()}\n\nThank you for your business.\n\nRegards,\nYour Company`;
    
    // Open default email client
    window.location.href = `mailto:${invoice.clients?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    toast.success("Email client opened with invoice details");
  };

  return { sendEmail };
};

export default InvoiceEmailService;
