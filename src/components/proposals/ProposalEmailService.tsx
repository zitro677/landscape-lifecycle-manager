
import { Proposal } from "./types";
import { toast } from "sonner";
import { format } from "date-fns";
import ProposalPdfGenerator from "./ProposalPdfGenerator";

interface ProposalEmailServiceProps {
  proposal: Proposal;
}

const ProposalEmailService = ({ proposal }: ProposalEmailServiceProps) => {
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

  const sendEmail = () => {
    try {
      // Create email content
      const subject = `Proposal: ${proposal.title || `Proposal #${proposal.id.substring(0, 8)}`}`;
      const body = `Dear ${proposal.client_name},\n\nPlease find attached our proposal for your review.\n\nAmount: ${formatCurrency(Number(proposal.amount || 0))}\nValid until: ${formatDate(proposal.valid_until)}\n\n${proposal.content || ''}\n\nThank you for considering our services.\n\nBest regards,\nYour Company`;
      
      // Create and download the PDF
      const pdfGenerator = ProposalPdfGenerator({ proposal });
      const doc = pdfGenerator.generatePDF();
      
      // Guide the user
      toast.success(
        "PDF proposal has been downloaded. Please attach it to your email manually.", 
        { duration: 5000 }
      );
      
      // Open default email client
      window.location.href = `mailto:${proposal.clients?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch (err) {
      console.error("Error in sendEmail:", err);
      toast.error("Failed to prepare email");
    }
  };

  return { sendEmail };
};

export default ProposalEmailService;
