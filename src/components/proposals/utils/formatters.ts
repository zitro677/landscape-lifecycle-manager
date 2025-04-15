
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
  
  // Initialize with empty sections
  const sections: Record<string, string> = {
    "Project Scope": "",
    "Project Timeline": "",
    "Items & Services": "",
    "Terms & Notes": ""
  };
  
  // Check if content contains section markers
  const hasTimeline = content.includes("Timeline:");
  const hasItems = content.includes("Items:");
  const hasNotes = content.includes("Notes:");
  
  // If no markers, put all content in Project Scope
  if (!hasTimeline && !hasItems && !hasNotes) {
    sections["Project Scope"] = content.trim();
    return sections;
  }
  
  // Extract sections based on markers
  let remainingContent = content;
  
  // Extract Project Scope (everything before Timeline: or Items: or Notes:)
  let scopeEndIndex = content.length;
  if (hasTimeline) {
    scopeEndIndex = Math.min(scopeEndIndex, content.indexOf("Timeline:"));
  }
  if (hasItems) {
    scopeEndIndex = Math.min(scopeEndIndex, content.indexOf("Items:"));
  }
  if (hasNotes) {
    scopeEndIndex = Math.min(scopeEndIndex, content.indexOf("Notes:"));
  }
  
  sections["Project Scope"] = content.substring(0, scopeEndIndex).trim();
  
  // Extract Timeline
  if (hasTimeline) {
    const timelineStartIndex = content.indexOf("Timeline:") + "Timeline:".length;
    let timelineEndIndex = content.length;
    if (hasItems) {
      timelineEndIndex = Math.min(timelineEndIndex, content.indexOf("Items:"));
    }
    if (hasNotes) {
      timelineEndIndex = Math.min(timelineEndIndex, content.indexOf("Notes:"));
    }
    sections["Project Timeline"] = content.substring(timelineStartIndex, timelineEndIndex).trim();
  }
  
  // Extract Items
  if (hasItems) {
    const itemsStartIndex = content.indexOf("Items:") + "Items:".length;
    let itemsEndIndex = content.length;
    if (hasNotes) {
      itemsEndIndex = Math.min(itemsEndIndex, content.indexOf("Notes:"));
    }
    sections["Items & Services"] = content.substring(itemsStartIndex, itemsEndIndex).trim();
  }
  
  // Extract Notes
  if (hasNotes) {
    const notesStartIndex = content.indexOf("Notes:") + "Notes:".length;
    sections["Terms & Notes"] = content.substring(notesStartIndex).trim();
  }
  
  return sections;
};
