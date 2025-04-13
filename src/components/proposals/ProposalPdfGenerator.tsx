
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
      let yPosition = 20;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Add title
      doc.setFontSize(20);
      doc.text("PROPOSAL", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;
      
      // Add proposal identification
      doc.setFontSize(12);
      doc.text(`Proposal ID: ${proposal.id.substring(0, 8)}`, margin, yPosition);
      doc.text(`Status: ${proposal.status || "Draft"}`, pageWidth - margin, yPosition, { align: "right" });
      yPosition += 15;
      
      // Add client information in a box - only name (no address)
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition, contentWidth, 20, 'F');
      yPosition += 7;
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Client Information:", margin + 5, yPosition);
      doc.setFont(undefined, 'normal');
      yPosition += 7;
      
      doc.setFontSize(10);
      doc.text(`Name: ${proposal.client_name || "Client"}`, margin + 5, yPosition);
      yPosition += 15;
      
      // Proposal dates
      doc.text(`Issue Date: ${formatDate(proposal.issue_date)}`, margin, yPosition);
      doc.text(`Valid Until: ${formatDate(proposal.valid_until)}`, pageWidth - margin, yPosition, { align: "right" });
      yPosition += 15;
      
      // Project scope summary (simplified)
      if (proposal.content) {
        // Extract just the scope without going into timeline, items, notes
        let scopeContent = proposal.content;
        if (scopeContent.includes("Timeline:")) {
          scopeContent = scopeContent.split("Timeline:")[0];
        } else if (scopeContent.includes("Items:")) {
          scopeContent = scopeContent.split("Items:")[0];
        } else if (scopeContent.includes("Notes:")) {
          scopeContent = scopeContent.split("Notes:")[0];
        }
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("Project Summary:", margin, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 7;
        
        doc.setFontSize(10);
        const scopeLines = doc.splitTextToSize(scopeContent.trim(), contentWidth);
        doc.text(scopeLines, margin, yPosition);
        yPosition += scopeLines.length * 5 + 15;
      }
      
      // Calculate tax (7%)
      const subtotal = Number(proposal.amount || 0);
      const tax = subtotal * 0.07; // 7% tax rate
      const total = subtotal + tax;
      
      // Display pricing with tax
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Pricing:", margin, yPosition);
      doc.setFont(undefined, 'normal');
      yPosition += 7;
      
      doc.setFontSize(10);
      doc.text(`Subtotal: ${formatCurrency(subtotal)}`, margin, yPosition);
      yPosition += 6;
      doc.text(`Tax (7%): ${formatCurrency(tax)}`, margin, yPosition);
      yPosition += 6;
      
      // Total amount
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`Total Amount: ${formatCurrency(total)}`, pageWidth - margin, yPosition, { align: "right" });
      doc.setFont(undefined, 'normal');
      
      // Add footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Proposal generated on ${format(new Date(), 'MMM dd, yyyy')} - Page ${i} of ${pageCount}`,
          pageWidth / 2, 
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
