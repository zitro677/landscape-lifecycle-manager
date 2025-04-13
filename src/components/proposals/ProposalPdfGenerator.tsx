
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Proposal } from "./types";
import { toast } from "sonner";
import { format } from "date-fns";

interface ProposalPdfGeneratorProps {
  proposal: Proposal;
}

const ProposalPdfGenerator = ({ proposal }: ProposalPdfGeneratorProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text("PROPOSAL", 105, 20, { align: "center" });
      
      // Add proposal number
      doc.setFontSize(12);
      doc.text(`Proposal ID: ${proposal.id.substring(0, 8)}`, 20, 30);
      
      // Add status
      const statusText = `Status: ${proposal.status || "Draft"}`;
      doc.text(statusText, 190, 30, { align: "right" });
      
      // Add client information
      doc.setFontSize(12);
      doc.text("Client Information:", 20, 45);
      doc.setFontSize(10);
      doc.text(`To: ${proposal.client_name || "Client"}`, 20, 52);
      doc.text(`Date: ${formatDate(proposal.issue_date)}`, 20, 58);
      doc.text(`Valid Until: ${formatDate(proposal.valid_until)}`, 20, 64);
      
      // Add proposal content
      doc.setFontSize(12);
      doc.text("Proposal Details:", 20, 75);
      doc.setFontSize(10);
      
      // Handle multiline text
      const contentLines = doc.splitTextToSize(
        proposal.content || "No content provided", 
        170
      );
      doc.text(contentLines, 20, 82);
      
      // Add total
      const yPosition = 82 + contentLines.length * 5 + 20;
      doc.setFontSize(12);
      doc.text(`Total Amount: ${formatCurrency(Number(proposal.amount || 0))}`, 190, yPosition, { align: "right" });
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Proposal generated on ${format(new Date(), 'MMM dd, yyyy')} - Page ${i} of ${pageCount}`,
          105, 
          doc.internal.pageSize.height - 10, 
          { align: "center" }
        );
      }
      
      // Save the PDF
      doc.save(`Proposal_${proposal.id.substring(0, 8)}.pdf`);
      toast.success("PDF generated successfully");
      
      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
      return null;
    }
  };

  return { generatePDF };
};

export default ProposalPdfGenerator;
