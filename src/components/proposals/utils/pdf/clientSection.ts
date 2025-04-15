
import { jsPDF } from "jspdf";
import { Proposal } from "../../types";

export const addClientInformationSection = (
  doc: jsPDF, 
  proposal: Proposal, 
  startY: number,
  margin: number
) => {
  let yPosition = startY;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Client Information:", margin + 5, yPosition);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  yPosition += 7;
  doc.text(`${proposal.client_name || "Client"}`, margin + 5, yPosition);
  yPosition += 5;
  if (proposal.clients?.email) {
    doc.text(`${proposal.clients.email}`, margin + 5, yPosition);
    yPosition += 5;
  }
  if (proposal.clients?.address) {
    doc.text(`${proposal.clients.address}`, margin + 5, yPosition);
  }
  return yPosition;
};
