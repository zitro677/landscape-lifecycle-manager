
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
  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // 1) Header with logo + company info
      yPosition = await addHeaderSection(doc, "PROPOSAL", yPosition, pageWidth);

      // 2) Client info (left) + Proposal details (right)
      addClientInformationSection(doc, proposal, yPosition, margin);
      addProposalDetailsSection(doc, proposal, yPosition, pageWidth);
      yPosition += 50;

      // 3) Items table + pricing summary
      yPosition = addPricingSummarySection(
        doc,
        Number(proposal.amount || 0),
        margin,
        yPosition,
        pageWidth,
        contentWidth,
        proposal.items
      );

      // 4) Content sections (scope, timeline, notes) — structured, no parsing
      yPosition = addContentSections(
        doc,
        { scope: proposal.scope, timeline: proposal.timeline, notes: proposal.notes },
        margin,
        contentWidth,
        yPosition
      );

      // 5) Footer with contact info
      if (yPosition > doc.internal.pageSize.height - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(8);
      doc.setTextColor(145, 175, 140);
      doc.text("Green Landscape Irrigation", margin, yPosition);
      yPosition += 4;
      doc.text("Phone: (727) 484-5516 | Email: greenplanetlandscaping01@gmail.com", margin, yPosition);
      yPosition += 4;
      doc.text("Web: www.greenlandscapeirrigation.com", margin, yPosition);

      // Page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 160);
        doc.text(
          `Generated on ${format(new Date(), 'MMM dd, yyyy')}   —   Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }
      doc.setTextColor(0, 0, 0);

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
