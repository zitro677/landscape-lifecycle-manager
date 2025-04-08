
import { Invoice } from "./types";
import { formatCurrency } from "./utils";
import { toast } from "sonner";

interface InvoiceEmailServiceProps {
  invoice: Invoice;
}

const InvoiceEmailService = ({ invoice }: InvoiceEmailServiceProps) => {
  const createPdfContent = () => {
    // Create the PDF content as a data URI
    const htmlContent = `
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .invoice-number { font-size: 16px; color: #666; }
            .invoice-meta { margin-bottom: 30px; }
            .invoice-meta div { margin-bottom: 5px; }
            .amount { font-size: 18px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; border-bottom: 1px solid #ddd; padding: 10px 5px; }
            td { padding: 10px 5px; border-bottom: 1px solid #eee; }
            .total-row { font-weight: bold; }
            .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 14px; }
            .status-paid { background: #d1fae5; color: #047857; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-overdue { background: #fee2e2; color: #b91c1c; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-number">${invoice.invoice_number}</div>
            </div>
            <div>
              <div class="status status-${invoice.status?.toLowerCase()}">${invoice.status}</div>
            </div>
          </div>
          
          <div class="invoice-meta">
            <div><strong>To:</strong> ${invoice.client_name}</div>
            <div><strong>Date:</strong> ${new Date(invoice.issue_date).toLocaleDateString()}</div>
            <div><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Services</td>
                <td>${formatCurrency(Number(invoice.amount))}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total</strong></td>
                <td><strong>${formatCurrency(Number(invoice.amount))}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 40px;">
            <div><strong>Notes:</strong></div>
            <div>${invoice.notes || 'No additional notes'}</div>
          </div>
        </body>
      </html>
    `;
    
    // Convert HTML to base64 for data URI
    return btoa(unescape(encodeURIComponent(htmlContent)));
  };

  const sendEmail = () => {
    // Create email content
    const subject = `Invoice ${invoice.invoice_number}`;
    const body = `Dear ${invoice.client_name},\n\nPlease find attached invoice ${invoice.invoice_number} for ${formatCurrency(Number(invoice.amount))}.\n\nDue date: ${new Date(invoice.due_date).toLocaleDateString()}\n\nThank you for your business.\n\nRegards,\nYour Company`;
    
    // Generate the PDF content as a data URI
    const pdfContent = createPdfContent();
    
    // Since we can't directly attach files through mailto links, we'll guide the user
    toast.info("Preparing email with invoice information. You'll need to manually attach the PDF from the Downloads folder.", 
      { duration: 5000 }
    );
    
    // Open default email client
    window.location.href = `mailto:${invoice.clients?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Also trigger a download of the invoice as PDF
    const dataUri = `data:application/pdf;base64,${pdfContent}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUri;
    downloadLink.download = `Invoice_${invoice.invoice_number}.pdf`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return { sendEmail };
};

export default InvoiceEmailService;
