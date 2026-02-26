
import { jsPDF } from "jspdf";
import { Proposal } from "../../types";
import { formatDate } from "../formatters";

export const addClientInformationSection = (
  doc: jsPDF,
  proposal: Proposal,
  startY: number,
  margin: number
) => {
  // This is now the "Proposal Title Section" matching the HTML template
  // Left side: Official Proposal label + title + client name
  // Right side: meta card with proposal #, dates, status

  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = startY;

  // Light cream background band
  doc.setFillColor(248, 250, 249);
  doc.setDrawColor(216, 243, 220);
  doc.rect(0, yPosition - 4, pageWidth, 52, 'FD');

  // Left side: "OFFICIAL PROPOSAL" label
  const leftX = margin;
  let leftY = yPosition + 4;
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(82, 183, 136); // --accent
  doc.text("OFFICIAL PROPOSAL", leftX, leftY);

  // Proposal title
  leftY += 10;
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(27, 67, 50); // --primary-dark
  const titleText = proposal.title || "Proposal";
  const titleLines = doc.splitTextToSize(titleText, contentWidth * 0.5);
  doc.text(titleLines, leftX, leftY);
  leftY += titleLines.length * 7 + 4;

  // Client name
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(108, 117, 125); // --text-muted
  doc.text(`Prepared for: ${proposal.client_name || "Client"}`, leftX, leftY);

  // Right side: meta card
  const metaBoxWidth = 72;
  const metaBoxX = pageWidth - margin - metaBoxWidth;
  const metaBoxY = yPosition;
  const metaBoxH = 44;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(216, 243, 220);
  doc.roundedRect(metaBoxX, metaBoxY, metaBoxWidth, metaBoxH, 3, 3, 'FD');

  let metaY = metaBoxY + 8;
  const labelX = metaBoxX + 5;
  const valX = metaBoxX + metaBoxWidth - 5;

  const metaRows = [
    { label: "PROPOSAL #", value: proposal.proposal_number || "—" },
    { label: "DATE ISSUED", value: formatDate(proposal.issue_date) },
    { label: "VALID UNTIL", value: formatDate(proposal.valid_until) },
  ];

  metaRows.forEach((row, i) => {
    doc.setFontSize(7);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(108, 117, 125);
    doc.text(row.label, labelX, metaY);

    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(27, 67, 50);
    doc.text(row.value, valX, metaY, { align: "right" });

    if (i < metaRows.length - 1) {
      metaY += 3;
      doc.setDrawColor(216, 243, 220);
      doc.setLineWidth(0.3);
      doc.line(labelX, metaY, valX, metaY);
    }
    metaY += 9;
  });

  doc.setTextColor(0, 0, 0);
  return startY + 54;
};
