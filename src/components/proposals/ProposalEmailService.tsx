
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
      
      // Build a comprehensive email body
      let body = `Dear ${proposal.client_name},\n\n`;
      body += `Please find attached our proposal for your review.\n\n`;
      
      // Add client address if available
      if (proposal.clients?.address) {
        body += `Delivery Address:\n${proposal.clients.address}\n\n`;
      }
      
      // Parse content to extract sections
      if (proposal.content) {
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
        
        // Add project scope
        body += `Project Scope:\n${scopeContent}\n\n`;
        
        // Add timeline if available
        if (timelineContent) {
          body += `Project Timeline:\n${timelineContent}\n\n`;
        }
        
        // Add items if available
        if (itemsContent) {
          body += `Items & Services:\n${itemsContent}\n\n`;
        }
        
        // Add notes if available
        if (notesContent) {
          body += `Terms & Notes:\n${notesContent}\n\n`;
        }
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
