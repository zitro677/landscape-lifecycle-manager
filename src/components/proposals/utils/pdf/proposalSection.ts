
import { jsPDF } from "jspdf";
import { Proposal } from "../../types";

// This section is now handled by the combined clientSection.ts
// Kept as a no-op for backward compatibility with the barrel export
export const addProposalDetailsSection = (
  doc: jsPDF,
  proposal: Proposal,
  startY: number,
  pageWidth: number
) => {
  // No-op: proposal details are now rendered inside addClientInformationSection
  return startY;
};
