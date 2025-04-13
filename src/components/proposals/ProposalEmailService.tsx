
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
      
      // Calculate tax and total
      const subtotal = Number(proposal.amount || 0);
      const tax = subtotal * 0.07; // 7% tax rate
      const total = subtotal + tax;
      
      // Build a simplified email body (no address, timeline, items or notes)
      let body = `Dear ${proposal.client_name},\n\n`;
      body += `Please find attached our proposal for your review.\n\n`;
      
      // Only add a brief summary from content if it exists
      if (proposal.content) {
        let scopeContent = proposal.content;
        if (scopeContent.includes("Timeline:")) {
          scopeContent = scopeContent.split("Timeline:")[0];
        } else if (scopeContent.includes("Items:")) {
          scopeContent = scopeContent.split("Items:")[0];
        } else if (scopeContent.includes("Notes:")) {
          scopeContent = scopeContent.split("Notes:")[0];
        }
        body += `Project Summary: ${scopeContent.trim()}\n\n`;
      }
      
      // Add pricing with tax
      body += `Subtotal: ${formatCurrency(subtotal)}\n`;
      body += `Tax (7%): ${formatCurrency(tax)}\n`;
      body += `Total Amount: ${formatCurrency(total)}\n\n`;
      body += `Issue Date: ${formatDate(proposal.issue_date)}\n`;
      body += `Valid until: ${formatDate(proposal.valid_until)}\n\n`;
      
      body += `Thank you for considering our services.\n\n`;
      body += `Best regards,\nYour Company`;
      
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
