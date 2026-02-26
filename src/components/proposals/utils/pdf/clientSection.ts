
import { jsPDF } from "jspdf";
import { Proposal } from "../../types";
import { formatDate } from "../formatters";

export const addClientInformationSection = (
  doc: jsPDF,
  proposal: Proposal,
  startY: number,
  margin: number
) => {
  const pageWidth = doc.internal.pageSize.width;
  const sectionHeight = 46;

  // Cream background band
  doc.setFillColor(248, 250, 249);
  doc.setDrawColor(216, 243, 220);
  doc.rect(0, startY, pageWidth, sectionHeight, 'FD');

  // Left side
  const leftX = margin;
  let leftY = startY + 10;

  // "OFFICIAL PROPOSAL" label
  doc.setFontSize(7);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(82, 183, 136);
  doc.text("OFFICIAL PROPOSAL", leftX, leftY);

  // Proposal title
  leftY += 9;
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(27, 67, 50);
  const titleText = proposal.title || "Proposal";
  const titleLines = doc.splitTextToSize(titleText, pageWidth * 0.42);
  doc.text(titleLines, leftX, leftY);
  leftY += titleLines.length * 6 + 3;

  // Client name
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(108, 117, 125);
  doc.text(`Prepared for: ${proposal.client_name || "Client"}`, leftX, leftY);

  // Right side: meta card
  const metaBoxWidth = 70;
  const metaBoxX = pageWidth - margin - metaBoxWidth;
  const metaBoxY = startY + 4;
  const metaBoxH = 38;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(216, 243, 220);
  doc.roundedRect(metaBoxX, metaBoxY, metaBoxWidth, metaBoxH, 3, 3, 'FD');

  const metaRows = [
    { label: "Proposal #", value: proposal.proposal_number || "—" },
    { label: "Date Issued", value: formatDate(proposal.issue_date) },
    { label: "Valid Until", value: formatDate(proposal.valid_until) },
    { label: "Status", value: (proposal.status || "Draft") },
  ];

  let metaY = metaBoxY + 8;
  const labelX = metaBoxX + 5;
  const valX = metaBoxX + metaBoxWidth - 5;

  metaRows.forEach((row, i) => {
    doc.setFontSize(6);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(108, 117, 125);
    doc.text(row.label, labelX, metaY);

    if (row.label === "Status") {
      const statusText = row.value;
      doc.setFontSize(6);
      doc.setFont(undefined, 'bold');
      const textWidth = doc.getTextWidth(statusText);
      const badgeW = textWidth + 6;
      const badgeX = valX - badgeW;
      const badgeY = metaY - 3;
      doc.setFillColor(116, 198, 157);
      doc.roundedRect(badgeX, badgeY, badgeW, 5, 1.5, 1.5, 'F');
      doc.setTextColor(27, 67, 50);
      doc.text(statusText, badgeX + badgeW / 2, metaY, { align: "center" });
    } else {
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(27, 67, 50);
      doc.text(row.value, valX, metaY, { align: "right" });
    }

    if (i < metaRows.length - 1) {
      metaY += 2;
      doc.setDrawColor(216, 243, 220);
      doc.setLineWidth(0.2);
      doc.line(labelX, metaY, valX, metaY);
    }
    metaY += 7;
  });

  doc.setTextColor(0, 0, 0);
  return startY + sectionHeight + 1;
};
