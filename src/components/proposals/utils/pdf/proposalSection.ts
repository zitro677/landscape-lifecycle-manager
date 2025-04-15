
import { jsPDF } from "jspdf";
import { Proposal } from "../../types";
import { formatDate } from "../formatters";

export const addProposalDetailsSection = (
  doc: jsPDF,
  proposal: Proposal,
  startY: number,
  pageWidth: number
) => {
  let rightColumn = pageWidth / 2;
  let rightYPosition = startY - 17;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Proposal Details:", rightColumn, rightYPosition);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  rightYPosition += 7;
  doc.text(`Issue Date: ${formatDate(proposal.issue_date)}`, rightColumn, rightYPosition);
  rightYPosition += 5;
  doc.text(`Valid Until: ${formatDate(proposal.valid_until)}`, rightColumn, rightYPosition);
  rightYPosition += 5;
  doc.text(`Status: ${proposal.status || "Draft"}`, rightColumn, rightYPosition);
  return rightYPosition;
};
