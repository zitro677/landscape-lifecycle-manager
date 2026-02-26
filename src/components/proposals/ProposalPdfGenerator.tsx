
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Proposal } from "./types";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  addHeaderSection,
  addClientInformationSection,
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

      // 1) Header with logo + contact info
      let yPosition = await addHeaderSection(doc, "PROPOSAL", 0, pageWidth);

      // 2) Title section (Official Proposal, title, client, meta card)
      yPosition = addClientInformationSection(doc, proposal, yPosition, margin);

      // 3) Build items array
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

      // 4) Services table
      yPosition = addServicesTable(doc, margin, yPosition, contentWidth, items);

      // 5) Scope/Timeline + Totals (side by side conceptually — scope left, totals right)
      const scopeStartY = yPosition;
      yPosition = addScopeAndTimeline(
        doc,
        { scope: proposal.scope, timeline: proposal.timeline },
        margin,
        contentWidth,
        yPosition
      );

      // Place totals box on the right, aligned with scope start
      const totalsY = scopeStartY;
      addTotalsBox(doc, Number(proposal.amount || 0), margin, totalsY, pageWidth);

      // Make sure yPosition accounts for totals box height too
      const totalsEndY = totalsY + 56;
      if (totalsEndY > yPosition) yPosition = totalsEndY;

      // 6) Terms & Conditions (notes)
      yPosition = addNotesSection(doc, proposal.notes, margin, contentWidth, yPosition);

      // 7) Footer
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
