
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
      // Create email subject
      const subject = `Proposal: ${proposal.title || `Proposal #${proposal.id.substring(0, 8)}`}`;
      
      // Calculate pricing
      const subtotal = Number(proposal.amount || 0);
      const tax = subtotal * 0.07; // 7% tax rate
      const total = subtotal + tax;
      
      // Build email body with key information first
      let body = `Dear ${proposal.client_name},\n\n`;
      body += `Please find our proposal for your review.\n\n`;
      
      // Key Information Section
      body += `CLIENT INFORMATION\n`;
      body += `----------------\n`;
      body += `Name: ${proposal.client_name}\n`;
      if (proposal.clients?.email) {
        body += `Email: ${proposal.clients.email}\n`;
      }
      if (proposal.clients?.address) {
        body += `Address: ${proposal.clients.address}\n`;
      }
      body += `\n`;
      
      // Proposal Details
      body += `PROPOSAL DETAILS\n`;
      body += `----------------\n`;
      body += `Issue Date: ${formatDate(proposal.issue_date)}\n`;
      body += `Valid Until: ${formatDate(proposal.valid_until)}\n`;
      body += `Status: ${proposal.status || "Draft"}\n\n`;
      
      // Pricing Summary
      body += `PRICING SUMMARY\n`;
      body += `---------------\n`;
      body += `Subtotal: ${formatCurrency(subtotal)}\n`;
      body += `Tax (7%): ${formatCurrency(tax)}\n`;
      body += `Total Amount: ${formatCurrency(total)}\n\n`;
      
      // Additional Sections from content
      if (proposal.content) {
        // Parse sections from content
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
        
        // Add Project Scope
        body += `PROJECT SCOPE\n`;
        body += `-------------\n`;
        body += `${scopeContent}\n\n`;
        
        // Add Timeline if available
        if (timelineContent) {
          body += `PROJECT TIMELINE\n`;
          body += `----------------\n`;
          body += `${timelineContent}\n\n`;
        }
        
        // Add Items if available
        if (itemsContent) {
          body += `ITEMS & SERVICES\n`;
          body += `----------------\n`;
          body += `${itemsContent}\n\n`;
        }
        
        // Add Notes if available
        if (notesContent) {
          body += `TERMS & NOTES\n`;
          body += `-------------\n`;
          body += `${notesContent}\n\n`;
        }
      }
      
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

