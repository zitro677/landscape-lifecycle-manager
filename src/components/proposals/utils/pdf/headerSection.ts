
import { jsPDF } from "jspdf";

export const addHeaderSection = (doc: jsPDF, title: string, yPosition: number, pageWidth: number) => {
  doc.setFontSize(20);
  doc.text(title, pageWidth / 2, yPosition, { align: "center" });
  return yPosition + 10;
};
