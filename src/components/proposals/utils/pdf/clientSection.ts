
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
  const sectionHeight = 62;

  // Cream background band
  doc.setFillColor(248, 250, 249);
  doc.setDrawColor(216, 243, 220);
  doc.rect(0, startY, pageWidth, sectionHeight, 'FD');

  // Left side
  const leftX = margin;
  let leftY = startY + 14;

  // "OFFICIAL PROPOSAL" label
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(82, 183, 136);
  doc.text("OFFICIAL PROPOSAL", leftX, leftY);

  // Proposal title
  leftY += 12;
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(27, 67, 50);
  const titleText = proposal.title || "Proposal";
  const titleLines = doc.splitTextToSize(titleText, pageWidth * 0.45);
  doc.text(titleLines, leftX, leftY);
  leftY += titleLines.length * 8 + 4;

  // Client name
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(108, 117, 125);
  doc.text(`Prepared for: ${proposal.client_name || "Client"}`, leftX, leftY);

  // Right side: meta card
  const metaBoxWidth = 74;
  const metaBoxX = pageWidth - margin - metaBoxWidth;
  const metaBoxY = startY + 6;
  const metaBoxH = 50;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(216, 243, 220);
  doc.roundedRect(metaBoxX, metaBoxY, metaBoxWidth, metaBoxH, 3, 3, 'FD');

  const metaRows = [
    { label: "Proposal #", value: proposal.proposal_number || "—" },
    { label: "Date Issued", value: formatDate(proposal.issue_date) },
    { label: "Valid Until", value: formatDate(proposal.valid_until) },
    { label: "Status", value: (proposal.status || "Draft") },
  ];

  let metaY = metaBoxY + 10;
  const labelX = metaBoxX + 6;
  const valX = metaBoxX + metaBoxWidth - 6;

  metaRows.forEach((row, i) => {
    doc.setFontSize(7);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(108, 117, 125);
    doc.text(row.label, labelX, metaY);

    if (row.label === "Status") {
      // Status badge style
      const statusText = row.value;
      doc.setFontSize(7);
      doc.setFont(undefined, 'bold');
      const textWidth = doc.getTextWidth(statusText);
      const badgeW = textWidth + 8;
      const badgeX = valX - badgeW;
      const badgeY = metaY - 4;
      doc.setFillColor(116, 198, 157); // accent-light
      doc.roundedRect(badgeX, badgeY, badgeW, 6, 2, 2, 'F');
      doc.setTextColor(27, 67, 50);
      doc.text(statusText, badgeX + badgeW / 2, metaY, { align: "center" });
    } else {
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(27, 67, 50);
      doc.text(row.value, valX, metaY, { align: "right" });
    }

    if (i < metaRows.length - 1) {
      metaY += 3;
      doc.setDrawColor(216, 243, 220);
      doc.setLineWidth(0.3);
      doc.line(labelX, metaY, valX, metaY);
    }
    metaY += 9;
  });

  doc.setTextColor(0, 0, 0);
  return startY + sectionHeight + 2;
};
