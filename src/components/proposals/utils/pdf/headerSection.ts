
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
  const headerHeight = 38;

  // Gradient background: dark green to medium green
  doc.setFillColor(27, 67, 50);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  // Lighter overlay on right half
  doc.setFillColor(45, 106, 79);
  doc.rect(pageWidth * 0.55, 0, pageWidth * 0.45, headerHeight, 'F');

  // Logo
  const logoSize = 20;
  const logoX = 16;
  const logoY = 9;

  try {
    const logoBase64 = await getImageDataUrl(logoUrl);
    if (logoBase64) {
      doc.setFillColor(255, 255, 255);
      doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 1.5, 'F');
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoSize, logoSize);
    }
  } catch {
    doc.setFillColor(255, 255, 255);
    doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 1.5, 'F');
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(27, 67, 50);
    doc.text("GLI", logoX + logoSize / 2, logoY + logoSize / 2 + 3, { align: "center" });
  }

  // Company name
  const textX = logoX + logoSize + 10;
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text("GREEN LANDSCAPE IRRIGATION", textX, 22);

  // Tagline
  doc.setFontSize(7);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(200, 230, 210);
  doc.text("Professional Landscaping & Irrigation Services", textX, 28);

  // Contact info on the right
  const rightX = pageWidth - 16;
  doc.setFontSize(7);
  doc.setTextColor(220, 240, 225);
  doc.text("(727) 484-5516", rightX, 16, { align: "right" });
  doc.text("greenplanetlandscaping01@gmail.com", rightX, 22, { align: "right" });
  doc.text("Serving Greater Tampa Bay Area", rightX, 28, { align: "right" });

  doc.setTextColor(0, 0, 0);
  return headerHeight;
};
