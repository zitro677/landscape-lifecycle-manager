
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail, X } from "lucide-react";
import { Proposal } from "./types";
import { formatDate, formatCurrency, parseProposalContent } from "./utils/formatters";

interface ProposalViewDialogProps {
  proposal: Proposal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadPDF: () => void;
  onSendEmail: () => void;
}

const ProposalViewDialog: React.FC<ProposalViewDialogProps> = ({
  proposal,
  open,
  onOpenChange,
  onDownloadPDF,
  onSendEmail,
}) => {
  // Parse the content into sections
  const contentSections = parseProposalContent(proposal.content);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Proposal {proposal.id?.substring(0, 8)}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-xl font-bold">{proposal.title || "Proposal"}</h2>
              <p className="text-muted-foreground">
                {formatDate(proposal.issue_date)}
              </p>
            </div>
            <div className="mt-2 md:mt-0 md:text-right">
              <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {proposal.status || "Draft"}
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="p-4 border rounded-md bg-muted/20">
            <h3 className="text-sm font-medium mb-2">Client Information</h3>
            <p>{proposal.client_name || "No client specified"}</p>
            <p>{proposal.clients?.email || ""}</p>
            <p>{proposal.clients?.address || ""}</p>
          </div>

          {/* Proposal Content Sections */}
          {Object.entries(contentSections).map(([title, content]) => (
            content ? (
              <div key={title} className="space-y-2">
                <h3 className="text-sm font-medium">{title}</h3>
                <div className="p-4 border rounded-md whitespace-pre-wrap">
                  {content}
                </div>
              </div>
            ) : null
          ))}

          {/* Amount */}
          <div className="flex justify-between font-medium text-lg">
            <span>Total Amount:</span>
            <span>{formatCurrency(Number(proposal.amount))}</span>
          </div>

          {/* Valid Until */}
          <div className="text-sm text-muted-foreground">
            Valid until: {formatDate(proposal.valid_until)}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onSendEmail}>
            <Mail className="h-4 w-4 mr-2" /> Email
          </Button>
          <Button onClick={onDownloadPDF}>
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalViewDialog;
