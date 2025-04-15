
import { format } from "date-fns";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
};

// Parse proposal content into sections
export const parseProposalContent = (content?: string) => {
  if (!content) return {
    "Project Scope": "",
    "Project Timeline": "",
    "Items & Services": "",
    "Terms & Notes": ""
  };
  
  const sections: Record<string, string> = {
    "Project Scope": "",
    "Project Timeline": "",
    "Items & Services": "",
    "Terms & Notes": ""
  };
  
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
