
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
import { Invoice } from "./types";
import { toast } from "sonner";
import InvoiceViewDialog from "./InvoiceViewDialog";
import InvoicePdfGenerator from "./InvoicePdfGenerator";
import InvoiceEmailService from "./InvoiceEmailService";
import InvoiceStatusManager from "./InvoiceStatusManager";

interface InvoiceActionsProps {
  invoice: Invoice;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ invoice }) => {
  const navigate = useNavigate();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Use our new service components
  const pdfGenerator = InvoicePdfGenerator({ invoice });
  const emailService = InvoiceEmailService({ invoice });
  const statusManager = InvoiceStatusManager({ invoice });

  const handleViewInvoice = () => {
    console.log("Viewing invoice:", invoice.id);
    setViewDialogOpen(true);
  };

  const handleDownloadPDF = () => {
    pdfGenerator.generatePDF();
  };

  const handleSendEmail = () => {
    emailService.sendEmail();
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
              <DropdownMenuItem onClick={statusManager.markAsPaid}>
                <CheckCircle className="h-4 w-4 mr-2" /> Mark as Paid
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleEditInvoice}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-500"
              onClick={statusManager.deleteInvoiceHandler}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <InvoiceViewDialog
        invoice={invoice}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onDownloadPDF={handleDownloadPDF}
        onSendEmail={handleSendEmail}
      />
    </>
  );
};

export default InvoiceActions;
