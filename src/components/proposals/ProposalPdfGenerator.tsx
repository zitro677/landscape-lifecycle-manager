
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
      
      // Add client information in a box with address
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition, contentWidth, 30, 'F');
      yPosition += 7;
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Client Information:", margin + 5, yPosition);
      doc.setFont(undefined, 'normal');
      yPosition += 7;
      
      doc.setFontSize(10);
      doc.text(`Name: ${proposal.client_name || "Client"}`, margin + 5, yPosition);
      yPosition += 5;
      
      // Add client email if available
      if (proposal.clients?.email) {
        doc.text(`Email: ${proposal.clients.email}`, margin + 5, yPosition);
        yPosition += 5;
      }
      
      // Add client address if available
      if (proposal.clients?.address) {
        doc.text(`Address: ${proposal.clients.address}`, margin + 5, yPosition);
        yPosition += 5;
      }
      
      yPosition += 10;
      
      // Proposal dates
      doc.text(`Issue Date: ${formatDate(proposal.issue_date)}`, margin, yPosition);
      doc.text(`Valid Until: ${formatDate(proposal.valid_until)}`, pageWidth - margin, yPosition, { align: "right" });
      yPosition += 15;
      
      // Project scope
      if (proposal.content) {
        // Parse content to extract sections
        let content = proposal.content;
        let scopeContent = content;
        let timelineContent = "";
        let itemsContent = "";
        let notesContent = "";
        
        if (content.includes("Timeline:")) {
          const parts = content.split("Timeline:");
          scopeContent = parts[0].trim();
          const remainingContent = parts[1];
          
          if (remainingContent.includes("Items:")) {
            const timelineParts = remainingContent.split("Items:");
            timelineContent = timelineParts[0].trim();
            const afterTimelineContent = timelineParts[1];
            
            if (afterTimelineContent.includes("Notes:")) {
              const itemsParts = afterTimelineContent.split("Notes:");
              itemsContent = itemsParts[0].trim();
              notesContent = itemsParts[1].trim();
            } else {
              itemsContent = afterTimelineContent.trim();
            }
          } else if (remainingContent.includes("Notes:")) {
            const timelineParts = remainingContent.split("Notes:");
            timelineContent = timelineParts[0].trim();
            notesContent = timelineParts[1].trim();
          } else {
            timelineContent = remainingContent.trim();
          }
        } else if (content.includes("Items:")) {
          const parts = content.split("Items:");
          scopeContent = parts[0].trim();
          const afterScopeContent = parts[1];
          
          if (afterScopeContent.includes("Notes:")) {
            const itemsParts = afterScopeContent.split("Notes:");
            itemsContent = itemsParts[0].trim();
            notesContent = itemsParts[1].trim();
          } else {
            itemsContent = afterScopeContent.trim();
          }
        } else if (content.includes("Notes:")) {
          const parts = content.split("Notes:");
          scopeContent = parts[0].trim();
          notesContent = parts[1].trim();
        }
        
        // Project Scope
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("Project Scope:", margin, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 7;
        
        doc.setFontSize(10);
        const scopeLines = doc.splitTextToSize(scopeContent, contentWidth);
        doc.text(scopeLines, margin, yPosition);
        yPosition += scopeLines.length * 5 + 10;
        
        // Project Timeline (if available)
        if (timelineContent) {
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text("Project Timeline:", margin, yPosition);
          doc.setFont(undefined, 'normal');
          yPosition += 7;
          
          doc.setFontSize(10);
          const timelineLines = doc.splitTextToSize(timelineContent, contentWidth);
          doc.text(timelineLines, margin, yPosition);
          yPosition += timelineLines.length * 5 + 10;
        }
        
        // Items & Services (if available)
        if (itemsContent) {
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text("Items & Services:", margin, yPosition);
          doc.setFont(undefined, 'normal');
          yPosition += 7;
          
          doc.setFontSize(10);
          const itemsLines = doc.splitTextToSize(itemsContent, contentWidth);
          doc.text(itemsLines, margin, yPosition);
          yPosition += itemsLines.length * 5 + 10;
        }
        
        // Terms & Notes (if available)
        if (notesContent) {
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text("Terms & Notes:", margin, yPosition);
          doc.setFont(undefined, 'normal');
          yPosition += 7;
          
          doc.setFontSize(10);
          const notesLines = doc.splitTextToSize(notesContent, contentWidth);
          doc.text(notesLines, margin, yPosition);
          yPosition += notesLines.length * 5 + 15;
        }
      }
      
      // Check if we need to add a new page for pricing
      if (yPosition > doc.internal.pageSize.height - 60) {
        doc.addPage();
        yPosition = 20;
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
