
import { jsPDF } from "jspdf";

const logoUrl = "/lovable-uploads/d13d02a7-c0f4-4b0a-828d-cc566f2b3d02.png";

const getImageDataUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No 2D context")); return; }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

export const addHeaderSection = async (doc: jsPDF, title: string, yPositionInitial: number, pageWidth: number) => {
  const margin = 0;
  const headerHeight = 52;

  // Dark green gradient header background
  doc.setFillColor(27, 67, 50); // --primary-dark
  doc.rect(margin, margin, pageWidth, headerHeight, 'F');

  // Lighter green overlay on right half for gradient effect
  doc.setFillColor(45, 106, 79); // --primary
  doc.rect(pageWidth * 0.5, margin, pageWidth * 0.5, headerHeight, 'F');

  // Try to load logo
  const logoSize = 28;
  const logoX = 20;
  const logoY = 12;
  let logoLoaded = false;

  try {
    const logoBase64 = await getImageDataUrl(logoUrl);
    if (logoBase64) {
      // White circle behind logo
      doc.setFillColor(255, 255, 255);
      doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 2, 'F');
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoSize, logoSize);
      logoLoaded = true;
    }
  } catch {
    // Fallback: text circle
    doc.setFillColor(255, 255, 255);
    doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 2, 'F');
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(27, 67, 50);
    doc.text("GLI", logoX + logoSize / 2, logoY + logoSize / 2 + 3, { align: "center" });
  }

  // Company name
  const textX = logoLoaded ? logoX + logoSize + 10 : logoX + logoSize + 10;
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text("GREEN LANDSCAPE IRRIGATION", textX, 24);

  // Tagline
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(200, 230, 210);
  doc.text("Professional Landscaping & Irrigation Services", textX, 31);

  // Contact info on the right
  const rightX = pageWidth - 20;
  doc.setFontSize(8);
  doc.setTextColor(220, 240, 225);
  doc.text("(727) 484-5516", rightX, 20, { align: "right" });
  doc.text("greenplanetlandscaping01@gmail.com", rightX, 26, { align: "right" });
  doc.text("Serving Greater Tampa Bay Area", rightX, 32, { align: "right" });

  doc.setTextColor(0, 0, 0);
  return headerHeight + 8;
};
