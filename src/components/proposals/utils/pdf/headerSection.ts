
import { jsPDF } from "jspdf";

export const addHeaderSection = (doc: jsPDF, title: string, yPosition: number, pageWidth: number) => {
  // Add company name
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text("Green Landscape Irrigation", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;
  
  // Add company contact information
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text("Phone: (727) 484-5516", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 5;
  
  doc.text("Email: greenplanetlandscaping01@gmail.com", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 5;
  
  doc.text("Web: www.greenlandscapeirrigation.com", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 15;
  
  // Add document title
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text(title, pageWidth / 2, yPosition, { align: "center" });
  
  return yPosition + 10;
};
