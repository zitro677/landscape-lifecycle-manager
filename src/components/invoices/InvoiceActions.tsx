
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Eye, MoreHorizontal, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useUpdateInvoiceStatus, useDeleteInvoice } from "./useInvoices";
import { Invoice } from "./types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "./utils";

interface InvoiceActionsProps {
  invoice: Invoice;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ invoice }) => {
  const navigate = useNavigate();
  const updateInvoiceStatus = useUpdateInvoiceStatus();
  const deleteInvoice = useDeleteInvoice();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleMarkAsPaid = async () => {
    try {
      await updateInvoiceStatus.mutateAsync({ id: invoice.id, status: "Paid" });
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
    }
  };

  const handleDeleteInvoice = async () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice.mutateAsync(invoice.id);
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const handleViewInvoice = () => {
    console.log("Viewing invoice:", invoice.id);
    setViewDialogOpen(true);
  };

  const handleSendEmail = () => {
    // Create email content
    const subject = `Invoice ${invoice.invoice_number}`;
    const body = `Dear ${invoice.client_name},\n\nPlease find attached invoice ${invoice.invoice_number} for ${formatCurrency(Number(invoice.amount))}.\n\nDue date: ${new Date(invoice.due_date).toLocaleDateString()}\n\nThank you for your business.\n\nRegards,\nYour Company`;
    
    // Open default email client
    window.location.href = `mailto:${invoice.clients?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    toast.success("Email client opened with invoice details");
  };

  const handleDownloadPDF = () => {
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

  const handleEditInvoice = () => {
    // For now, just log and show a toast notification
    toast.info(`Editing invoice ${invoice.invoice_number}`);
    // In a real implementation, you would navigate to the edit invoice page
    // navigate(`/invoices/edit/${invoice.id}`);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleViewInvoice}>
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        <Button size="sm" variant="outline" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-1" /> PDF
        </Button>
        <Button size="sm" variant="outline" onClick={handleSendEmail}>
          <Mail className="h-4 w-4 mr-1" /> Email
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {invoice.status !== "Paid" && (
              <DropdownMenuItem onClick={handleMarkAsPaid}>
                <CheckCircle className="h-4 w-4 mr-2" /> Mark as Paid
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleEditInvoice}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-500"
              onClick={handleDeleteInvoice}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice {invoice.invoice_number}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                <p className="text-base">{invoice.client_name}</p>
                {invoice.clients?.address && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {invoice.clients.address}
                  </p>
                )}
                {invoice.clients?.email && (
                  <p className="text-sm text-muted-foreground">
                    {invoice.clients.email}
                  </p>
                )}
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium text-muted-foreground">Invoice Details</h3>
                <p className="text-base">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {invoice.status}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Issue Date: {new Date(invoice.issue_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due Date: {new Date(invoice.due_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Summary</h3>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Subtotal</span>
                <span>{formatCurrency(Number(invoice.amount))}</span>
              </div>
              {invoice.tax_rate && Number(invoice.tax_rate) > 0 && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Tax ({invoice.tax_rate}%)</span>
                  <span>{formatCurrency(Number(invoice.amount) * (Number(invoice.tax_rate) / 100))}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 font-bold">
                <span>Total</span>
                <span>
                  {formatCurrency(
                    Number(invoice.amount) + (
                      invoice.tax_rate 
                        ? Number(invoice.amount) * (Number(invoice.tax_rate) / 100)
                        : 0
                    )
                  )}
                </span>
              </div>
            </div>

            {invoice.notes && (
              <div>
                <h3 className="text-sm font-medium">Notes</h3>
                <p className="text-sm text-muted-foreground mt-1">{invoice.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-1" /> Download PDF
              </Button>
              <Button variant="outline" onClick={handleSendEmail}>
                <Mail className="h-4 w-4 mr-1" /> Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceActions;
