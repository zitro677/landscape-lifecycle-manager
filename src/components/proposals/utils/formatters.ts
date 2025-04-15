
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
  
  console.log("Parsing content:", content);
  
  // Initialize with empty sections
  const sections: Record<string, string> = {
    "Project Scope": "",
    "Project Timeline": "",
    "Items & Services": "",
    "Terms & Notes": ""
  };
  
  // Simple case: if content doesn't have markers, put all in Project Scope
  if (!content.includes("Timeline:") && 
      !content.includes("Items:") && 
      !content.includes("Notes:")) {
    sections["Project Scope"] = content.trim();
    return sections;
  }
  
  // Use regex to match sections more reliably
  const timelineMatch = content.match(/Timeline:(.*?)(?=Items:|Notes:|$)/s);
  const itemsMatch = content.match(/Items:(.*?)(?=Notes:|$)/s);
  const notesMatch = content.match(/Notes:(.*?)$/s);
  
  // Extract scope (everything before Timeline: or Items: or Notes:)
  let scopeEndIndex = content.length;
  if (content.includes("Timeline:")) {
    scopeEndIndex = Math.min(scopeEndIndex, content.indexOf("Timeline:"));
  }
  if (content.includes("Items:")) {
    scopeEndIndex = Math.min(scopeEndIndex, content.indexOf("Items:"));
  }
  if (content.includes("Notes:")) {
    scopeEndIndex = Math.min(scopeEndIndex, content.indexOf("Notes:"));
  }
  
  sections["Project Scope"] = content.substring(0, scopeEndIndex).trim();
  
  // Extract other sections using regex matches
  if (timelineMatch && timelineMatch[1]) {
    sections["Project Timeline"] = timelineMatch[1].trim();
  }
  
  if (itemsMatch && itemsMatch[1]) {
    sections["Items & Services"] = itemsMatch[1].trim();
  }
  
  if (notesMatch && notesMatch[1]) {
    sections["Terms & Notes"] = notesMatch[1].trim();
  }
  
  console.log("Parsed sections:", sections);
  
  return sections;
};
