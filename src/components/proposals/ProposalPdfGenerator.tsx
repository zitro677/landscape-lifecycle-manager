
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Proposal } from "./types";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  addHeaderSection,
  addClientInformationSection,
  addProposalDetailsSection,
  addServicesTable,
  addTotalsBox,
  addScopeAndTimeline,
  addNotesSection,
} from "./utils/pdfSections";

interface ProposalPdfGeneratorProps {
  proposal: Proposal;
}

const ProposalPdfGenerator = ({ proposal }: ProposalPdfGeneratorProps) => {
  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // 1) Dark green branded header with logo + contact info
      let yPosition = await addHeaderSection(doc, "PROPOSAL", 0, pageWidth);

      // 2) Proposal title section (left: title+client, right: meta card)
      yPosition = addClientInformationSection(doc, proposal, yPosition, margin);
      // addProposalDetailsSection is now a no-op (merged into client section)
      addProposalDetailsSection(doc, proposal, yPosition, pageWidth);

      // 3) Build items array with fallback
      let items = Array.isArray(proposal.items) && proposal.items.length > 0 && !(proposal.items[0] as any)?.message
        ? proposal.items
        : Array.isArray((proposal as any).proposal_items) && (proposal as any).proposal_items.length > 0
          ? (proposal as any).proposal_items
          : [];

      if (items.length === 0 && Number(proposal.amount || 0) > 0) {
        items = [{
          description: "Project Services",
          quantity: 1,
          unit_price: Number(proposal.amount),
          amount: Number(proposal.amount),
        }];
      }

      // 4) Services table (items only)
      yPosition = addServicesTable(doc, margin, yPosition, contentWidth, items);

      // 5) Scope / Timeline content sections
      yPosition = addScopeAndTimeline(
        doc,
        { scope: proposal.scope, timeline: proposal.timeline },
        margin,
        contentWidth,
        yPosition
      );

      // 6) Totals box (after scope/timeline)
      yPosition = addTotalsBox(doc, Number(proposal.amount || 0), margin, yPosition, pageWidth);

      // 7) Terms & Conditions (notes)
      yPosition = addNotesSection(doc, proposal.notes, margin, contentWidth, yPosition);

      // 6) Footer with thank you + page numbers
      if (yPosition > doc.internal.pageSize.height - 25) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(9);
      doc.setTextColor(108, 117, 125);
      doc.text("Thank you for considering Green Landscape Irrigation for your project.", pageWidth / 2, yPosition + 4, { align: "center" });

      // Page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(160, 160, 160);
        doc.text(
          `Generated on ${format(new Date(), 'MMM dd, yyyy')}  •  Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 8,
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
