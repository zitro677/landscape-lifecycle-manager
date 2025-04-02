
import React from "react";
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

interface InvoiceActionsProps {
  invoice: Invoice;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ invoice }) => {
  const navigate = useNavigate();
  const updateInvoiceStatus = useUpdateInvoiceStatus();
  const deleteInvoice = useDeleteInvoice();

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
    // For now, just log and show a toast notification
    console.log("Viewing invoice:", invoice.id);
    toast.info(`Viewing invoice ${invoice.invoice_number}`);
    // In a real implementation, you would navigate to an invoice detail page
    // navigate(`/invoices/${invoice.id}`);
  };

  const handleSendEmail = () => {
    // In a real app, this would send an email with the invoice
    toast.info("Email functionality will be implemented soon");
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    toast.info("PDF generation will be implemented soon");
  };

  const handleEditInvoice = () => {
    // For now, just log and show a toast notification
    toast.info(`Editing invoice ${invoice.invoice_number}`);
    // In a real implementation, you would navigate to the edit invoice page
    // navigate(`/invoices/edit/${invoice.id}`);
  };

  return (
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
  );
};

export default InvoiceActions;
