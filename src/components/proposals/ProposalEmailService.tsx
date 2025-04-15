
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

  // Parse the content into sections
  const parseContent = (content?: string) => {
    if (!content) return {};
    
    const sections: Record<string, string> = {};
    
    // Use regex to extract sections
    const scopePattern = /(.*?)(Timeline:|$)/s;
    const timelinePattern = /Timeline:(.*?)(Items:|$)/s;
    const itemsPattern = /Items:(.*?)(Notes:|$)/s;
    const notesPattern = /Notes:(.*?)$/s;
    
    // Extract Project Scope
    const scopeMatch = content.match(scopePattern);
    if (scopeMatch && scopeMatch[1]) {
      sections["Project Scope"] = scopeMatch[1].trim();
    } else {
      sections["Project Scope"] = content.trim();
    }
    
    // Extract Timeline
    const timelineMatch = content.match(timelinePattern);
    if (timelineMatch && timelineMatch[1]) {
      sections["Project Timeline"] = timelineMatch[1].trim();
    }
    
    // Extract Items
    const itemsMatch = content.match(itemsPattern);
    if (itemsMatch && itemsMatch[1]) {
      sections["Items & Services"] = itemsMatch[1].trim();
    }
    
    // Extract Notes
    const notesMatch = content.match(notesPattern);
    if (notesMatch && notesMatch[1]) {
      sections["Terms & Notes"] = notesMatch[1].trim();
    }
    
    return sections;
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
      
      // Add content sections
      if (proposal.content) {
        const contentSections = parseContent(proposal.content);
        
        // Add sections in order
        if (contentSections["Project Scope"]) {
          body += `PROJECT SCOPE\n`;
          body += `-------------\n`;
          body += `${contentSections["Project Scope"]}\n\n`;
        }
        
        if (contentSections["Project Timeline"]) {
          body += `PROJECT TIMELINE\n`;
          body += `----------------\n`;
          body += `${contentSections["Project Timeline"]}\n\n`;
        }
        
        if (contentSections["Items & Services"]) {
          body += `ITEMS & SERVICES\n`;
          body += `----------------\n`;
          body += `${contentSections["Items & Services"]}\n\n`;
        }
        
        if (contentSections["Terms & Notes"]) {
          body += `TERMS & NOTES\n`;
          body += `-------------\n`;
          body += `${contentSections["Terms & Notes"]}\n\n`;
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
