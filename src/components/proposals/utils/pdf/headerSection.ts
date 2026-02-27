
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

  // Smooth gradient background using vertical strips
  const strips = 30;
  const stripWidth = pageWidth / strips;
  const startColor = { r: 27, g: 67, b: 50 };
  const endColor = { r: 64, g: 145, b: 108 };
  for (let i = 0; i < strips; i++) {
    const t = i / (strips - 1);
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * t);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * t);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * t);
    doc.setFillColor(r, g, b);
    doc.rect(i * stripWidth, 0, stripWidth + 0.5, headerHeight, 'F');
  }

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
