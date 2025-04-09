
import { Invoice } from "./types";
import { formatCurrency } from "./utils";
import { toast } from "sonner";

interface InvoicePdfGeneratorProps {
  invoice: Invoice;
}

const InvoicePdfGenerator = ({ invoice }: InvoicePdfGeneratorProps) => {
  const generatePDF = () => {
    // Create a printable version of the invoice
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups for this site.");
      return;
    }
    
    // Create invoice HTML content
    printWindow.document.write(`
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
            .text-right { text-align: right; }
            .total-row { font-weight: bold; }
            .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 14px; }
            .status-paid { background: #d1fae5; color: #047857; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-overdue { background: #fee2e2; color: #b91c1c; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
            }
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
                <th>Quantity</th>
                <th>Unit Price</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items && invoice.items.length > 0 ? 
                invoice.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(Number(item.unit_price))}</td>
                    <td class="text-right">${formatCurrency(Number(item.quantity) * Number(item.unit_price))}</td>
                  </tr>
                `).join('') 
                : 
                `<tr>
                  <td>Services</td>
                  <td>1</td>
                  <td>${formatCurrency(Number(invoice.amount))}</td>
                  <td class="text-right">${formatCurrency(Number(invoice.amount))}</td>
                </tr>`
              }
              <tr class="total-row">
                <td colspan="3" class="text-right"><strong>Total</strong></td>
                <td class="text-right"><strong>${formatCurrency(Number(invoice.amount))}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 40px;">
            <div><strong>Notes:</strong></div>
            <div>${invoice.notes || 'No additional notes'}</div>
          </div>
          
          <div class="no-print" style="margin-top: 40px; text-align: center;">
            <button onclick="window.print()">Print Invoice</button>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    // Give a moment for styles to load before showing print dialog
    setTimeout(() => {
      printWindow.print();
      toast.success("Invoice prepared for printing");
    }, 500);
  };

  return { generatePDF };
};

export default InvoicePdfGenerator;
