
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Proposal } from "./types";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  addHeaderSection,
  addClientInformationSection,
  addProposalDetailsSection,
  addPricingSummarySection,
  addContentSections,
} from "./utils/pdfSections";

interface ProposalPdfGeneratorProps {
  proposal: Proposal;
}

const ProposalPdfGenerator = ({ proposal }: ProposalPdfGeneratorProps) => {
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Header section
      yPosition = addHeaderSection(doc, "PROPOSAL", yPosition, pageWidth);

      // Key Information Box
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition, contentWidth, 60, 'FD');
      yPosition += 10;

      // Client Information and Proposal Details
      const clientInfoY = addClientInformationSection(doc, proposal, yPosition, margin);
      addProposalDetailsSection(doc, proposal, clientInfoY, pageWidth);

      // Reset position after the box and add pricing summary
      yPosition = clientInfoY + 45;
      yPosition = addPricingSummarySection(
        doc,
        Number(proposal.amount || 0),
        margin,
        yPosition,
        pageWidth,
        contentWidth
      );

      // Add content sections if available
      if (proposal.content) {
        yPosition = addContentSections(doc, proposal.content, margin, contentWidth, yPosition);
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
