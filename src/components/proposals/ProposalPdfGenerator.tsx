
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
      
      // Add client information in a box
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition, contentWidth, 35, 'F');
      yPosition += 7;
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Client Information:", margin + 5, yPosition);
      doc.setFont(undefined, 'normal');
      yPosition += 7;
      
      doc.setFontSize(10);
      doc.text(`Name: ${proposal.client_name || "Client"}`, margin + 5, yPosition);
      yPosition += 6;
      
      doc.text(`Email: ${proposal.clients?.email || "N/A"}`, margin + 5, yPosition);
      yPosition += 6;
      
      doc.text(`Address: ${proposal.clients?.address || "N/A"}`, margin + 5, yPosition);
      yPosition += 15;
      
      // Proposal dates
      doc.text(`Issue Date: ${formatDate(proposal.issue_date)}`, margin, yPosition);
      doc.text(`Valid Until: ${formatDate(proposal.valid_until)}`, pageWidth - margin, yPosition, { align: "right" });
      yPosition += 15;
      
      // Project Scope
      if (proposal.content) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("Project Scope:", margin, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 7;
        
        doc.setFontSize(10);
        const scopeLines = doc.splitTextToSize(proposal.content, contentWidth);
        doc.text(scopeLines, margin, yPosition);
        yPosition += scopeLines.length * 5 + 10;
      }
      
      // Check if we need a new page for timeline
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Timeline (if we have it)
      if (proposal.content && proposal.content.includes("Timeline:")) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("Project Timeline:", margin, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 7;
        
        // Extract timeline section if available
        const timelineContent = proposal.content.split("Timeline:")[1]?.split("Items:")[0] || "";
        
        doc.setFontSize(10);
        const timelineLines = doc.splitTextToSize(timelineContent.trim(), contentWidth);
        doc.text(timelineLines, margin, yPosition);
        yPosition += timelineLines.length * 5 + 10;
      }
      
      // Check if we need a new page for items
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Items & Services (if we have it)
      if (proposal.content && proposal.content.includes("Items:")) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("Items & Services:", margin, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 7;
        
        // Try to parse the items section if available
        let itemsContent = proposal.content.split("Items:")[1]?.split("Notes:")[0] || "";
        
        doc.setFontSize(10);
        const itemsLines = doc.splitTextToSize(itemsContent.trim(), contentWidth);
        doc.text(itemsLines, margin, yPosition);
        yPosition += itemsLines.length * 5 + 10;
        
        // Total amount
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Total Amount: ${formatCurrency(Number(proposal.amount || 0))}`, pageWidth - margin, yPosition, { align: "right" });
        doc.setFont(undefined, 'normal');
        yPosition += 15;
      } else {
        // If no items section, just show the total
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Total Amount: ${formatCurrency(Number(proposal.amount || 0))}`, pageWidth - margin, yPosition, { align: "right" });
        doc.setFont(undefined, 'normal');
        yPosition += 15;
      }
      
      // Check if we need a new page for terms
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Terms & Notes (if we have it)
      if (proposal.content && proposal.content.includes("Notes:")) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("Terms & Notes:", margin, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 7;
        
        // Extract notes section if available
        const notesContent = proposal.content.split("Notes:")[1] || "";
        
        doc.setFontSize(10);
        const notesLines = doc.splitTextToSize(notesContent.trim(), contentWidth);
        doc.text(notesLines, margin, yPosition);
      }
      
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
