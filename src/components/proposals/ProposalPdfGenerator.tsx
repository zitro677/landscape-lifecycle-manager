
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

      // Header section with key information
      doc.setFontSize(20);
      doc.text("PROPOSAL", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;

      // Key Information Box
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition, contentWidth, 60, 'FD');
      yPosition += 10;

      // Client Information (Left side)
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Client Information:", margin + 5, yPosition);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      yPosition += 7;
      doc.text(`${proposal.client_name || "Client"}`, margin + 5, yPosition);
      yPosition += 5;
      if (proposal.clients?.email) {
        doc.text(`${proposal.clients.email}`, margin + 5, yPosition);
        yPosition += 5;
      }
      if (proposal.clients?.address) {
        doc.text(`${proposal.clients.address}`, margin + 5, yPosition);
      }

      // Proposal Details (Right side)
      let rightColumn = pageWidth / 2;
      let rightYPosition = yPosition - 17;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Proposal Details:", rightColumn, rightYPosition);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      rightYPosition += 7;
      doc.text(`Issue Date: ${formatDate(proposal.issue_date)}`, rightColumn, rightYPosition);
      rightYPosition += 5;
      doc.text(`Valid Until: ${formatDate(proposal.valid_until)}`, rightColumn, rightYPosition);
      rightYPosition += 5;
      doc.text(`Status: ${proposal.status || "Draft"}`, rightColumn, rightYPosition);

      // Reset position after the box
      yPosition += 45;

      // Calculate pricing
      const subtotal = Number(proposal.amount || 0);
      const tax = subtotal * 0.07; // 7% tax rate
      const total = subtotal + tax;

      // Top Summary Box
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition, contentWidth, 30, 'FD');
      yPosition += 10;

      // Display total amount prominently
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Total Amount:", margin + 5, yPosition);
      doc.text(formatCurrency(total), pageWidth - margin - 5, yPosition, { align: "right" });
      yPosition += 7;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Subtotal: ${formatCurrency(subtotal)}`, margin + 5, yPosition);
      doc.text(`Tax (7%): ${formatCurrency(tax)}`, pageWidth - margin - 5, yPosition, { align: "right" });

      yPosition += 25;

      // Additional Sections
      if (proposal.content) {
        // Parse content sections
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
        }

        // Project Scope Section
        if (scopeContent) {
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text("Project Scope", margin, yPosition);
          yPosition += 7;
          doc.setFont(undefined, 'normal');
          doc.setFontSize(10);
          const scopeLines = doc.splitTextToSize(scopeContent, contentWidth);
          doc.text(scopeLines, margin, yPosition);
          yPosition += scopeLines.length * 5 + 10;
        }

        // Timeline Section
        if (timelineContent) {
          if (yPosition > doc.internal.pageSize.height - 60) {
            doc.addPage();
            yPosition = 20;
          }
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text("Project Timeline", margin, yPosition);
          yPosition += 7;
          doc.setFont(undefined, 'normal');
          doc.setFontSize(10);
          const timelineLines = doc.splitTextToSize(timelineContent, contentWidth);
          doc.text(timelineLines, margin, yPosition);
          yPosition += timelineLines.length * 5 + 10;
        }

        // Items & Services Section
        if (itemsContent) {
          if (yPosition > doc.internal.pageSize.height - 60) {
            doc.addPage();
            yPosition = 20;
          }
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text("Items & Services", margin, yPosition);
          yPosition += 7;
          doc.setFont(undefined, 'normal');
          doc.setFontSize(10);
          const itemsLines = doc.splitTextToSize(itemsContent, contentWidth);
          doc.text(itemsLines, margin, yPosition);
          yPosition += itemsLines.length * 5 + 10;
        }

        // Terms & Notes Section
        if (notesContent) {
          if (yPosition > doc.internal.pageSize.height - 60) {
            doc.addPage();
            yPosition = 20;
          }
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text("Terms & Notes", margin, yPosition);
          yPosition += 7;
          doc.setFont(undefined, 'normal');
          doc.setFontSize(10);
          const notesLines = doc.splitTextToSize(notesContent, contentWidth);
          doc.text(notesLines, margin, yPosition);
          yPosition += notesLines.length * 5 + 10;
        }
      }

      // Add footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Generated on ${format(new Date(), 'MMM dd, yyyy')} - Page ${i} of ${pageCount}`,
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

