
import { jsPDF } from "jspdf";

export const addHeaderSection = (doc: jsPDF, title: string, yPosition: number, pageWidth: number) => {
  // Add dark line
  doc.setDrawColor(93, 144, 73); // Green brand color
  doc.setLineWidth(1.5);
  doc.line(20, yPosition - 7, pageWidth - 20, yPosition - 7);

  // Add company logo placeholder (centered)
  const logoWidth = 28;
  const logoHeight = 14;
  doc.setFillColor(200, 230, 200);
  doc.rect(pageWidth / 2 - logoWidth / 2, yPosition - 2, logoWidth, logoHeight, 'F');
  doc.setFontSize(10);
  doc.setTextColor(93, 144, 73);
  doc.setFont(undefined, "bold");
  doc.text("LOGO", pageWidth / 2, yPosition + 6, { align: "center" });

  // Company name
  yPosition += 20;
  doc.setFontSize(18);
  doc.setTextColor(33, 53, 34);
  doc.text("Green Landscape Irrigation", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 7;
  // Contact info
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("Phone: (727) 484-5516    Email: greenplanetlandscaping01@gmail.com", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 5;
  doc.text("Web: www.greenlandscapeirrigation.com", pageWidth / 2, yPosition, { align: "center" });

  // Title with bottom highlight
  yPosition += 15;
  doc.setFont(undefined, "bold");
  doc.setFontSize(22);
  doc.setTextColor(93, 144, 73); // Green
  doc.text(title, pageWidth / 2, yPosition, { align: "center" });
  // Light line under title
  doc.setDrawColor(222, 232, 222);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 28, yPosition + 2, pageWidth / 2 + 28, yPosition + 2);

  // Reset textColor for next sections
  doc.setTextColor(0, 0, 0);
  return yPosition + 12;
};
