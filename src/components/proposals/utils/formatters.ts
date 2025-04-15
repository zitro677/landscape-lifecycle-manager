
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
  
  // Check if content contains section markers
  const hasTimeline = content.includes("Timeline:");
  const hasItems = content.includes("Items:");
  const hasNotes = content.includes("Notes:");
  
  if (!hasTimeline && !hasItems && !hasNotes) {
    // If no markers, put all content in Project Scope
    sections["Project Scope"] = content.trim();
    return sections;
  }
  
  // Extract Project Scope (everything before Timeline:)
  let scopeContent = content;
  if (hasTimeline) {
    const parts = content.split("Timeline:");
    scopeContent = parts[0];
    sections["Project Scope"] = scopeContent.trim();
    
    // Extract Timeline (content between Timeline: and Items:)
    let timelineContent = parts[1];
    if (hasItems) {
      const timelineParts = timelineContent.split("Items:");
      timelineContent = timelineParts[0];
      sections["Project Timeline"] = timelineContent.trim();
      
      // Extract Items (content between Items: and Notes:)
      let itemsContent = timelineParts[1];
      if (hasNotes) {
        const itemsParts = itemsContent.split("Notes:");
        itemsContent = itemsParts[0];
        sections["Items & Services"] = itemsContent.trim();
        
        // Extract Notes (everything after Notes:)
        sections["Terms & Notes"] = itemsParts[1].trim();
      } else {
        sections["Items & Services"] = itemsContent.trim();
      }
    } else if (hasNotes) {
      // If we have Timeline: and Notes: but no Items:
      const timelineParts = timelineContent.split("Notes:");
      timelineContent = timelineParts[0];
      sections["Project Timeline"] = timelineContent.trim();
      sections["Terms & Notes"] = timelineParts[1].trim();
    } else {
      // Just Timeline:
      sections["Project Timeline"] = timelineContent.trim();
    }
  } else if (hasItems) {
    // No Timeline: but has Items:
    const parts = content.split("Items:");
    scopeContent = parts[0];
    sections["Project Scope"] = scopeContent.trim();
    
    let itemsContent = parts[1];
    if (hasNotes) {
      const itemsParts = itemsContent.split("Notes:");
      itemsContent = itemsParts[0];
      sections["Items & Services"] = itemsContent.trim();
      sections["Terms & Notes"] = itemsParts[1].trim();
    } else {
      sections["Items & Services"] = itemsContent.trim();
    }
  } else if (hasNotes) {
    // Only has Notes:
    const parts = content.split("Notes:");
    scopeContent = parts[0];
    sections["Project Scope"] = scopeContent.trim();
    sections["Terms & Notes"] = parts[1].trim();
  }
  
  return sections;
};
