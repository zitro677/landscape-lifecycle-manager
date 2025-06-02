
import { jsPDF } from "jspdf";

// Updated logo URL to use the new Green Landscape Irrigation logo
const logoUrl = "/lovable-uploads/a1affb37-4921-4003-bdc3-84e84110c503.png";

/**
 * Load an image url to dataUrl (base64). This is async but for PDF export, we want users to wait a split second if needed for best logo quality.
 */
const getImageDataUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = function (err) {
      reject(err);
    };
    img.src = url;
  });
};

export const addHeaderSection = (doc: jsPDF, title: string, yPositionInitial: number, pageWidth: number) => {
  let yPosition = yPositionInitial;
  const marginLeft = 20;

  // Add green line under header
  doc.setDrawColor(93, 144, 73);
  doc.setLineWidth(1.5);
  doc.line(marginLeft, yPosition - 7, pageWidth - marginLeft, yPosition - 7);

  // Add logo left-aligned (adjusted size for better proportion)
  let logoHeight = 32;
  let logoWidth = 32;
  let logoLoaded = false;
  let logoY = yPosition - 2;
  let logoX = marginLeft;

  // Use the window cache approach for logo loading
  const _window = typeof window !== "undefined" ? window : {} as Window;
  interface ExtendedWindow extends Window {
    _PDF_LOGO_CACHE?: string | null;
  }
  const extWindow = _window as ExtendedWindow;
  
  if (!extWindow._PDF_LOGO_CACHE) {
    // Not loaded yet, block (synchronously) for this export.
    extWindow._PDF_LOGO_CACHE = undefined;
    throw new Error("Logo not loaded for PDF; try again in a second.");
  }
  
  const logoBase64 = extWindow._PDF_LOGO_CACHE;
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
      logoLoaded = true;
    } catch (e) {
      // If drawing logo fails, silently continue.
    }
  }

  // Company name next to logo - left aligned, shifted right, or centered if logo invisible
  let companyY = yPosition + 10;
  let nameX = logoLoaded ? marginLeft + logoWidth + 10 : pageWidth / 2;
  let align: "left" | "center" | "right" | "justify" = logoLoaded ? "left" : "center";

  doc.setFontSize(18);
  doc.setTextColor(33, 53, 34);
  doc.text("Green Landscape Irrigation", nameX, companyY, { align });

  // Company contact info under name
  companyY += 7;
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("Phone: (727) 484-5516    Email: greenplanetlandscaping01@gmail.com", nameX, companyY, { align });
  companyY += 5;
  doc.text("Web: www.greenlandscapeirrigation.com", nameX, companyY, { align });

  // Title centered under logo+company
  companyY += 15;
  doc.setFont(undefined, "bold");
  doc.setFontSize(22);
  doc.setTextColor(93, 144, 73);
  doc.text(title, pageWidth / 2, companyY, { align: "center" });
  // Light line under title
  doc.setDrawColor(222, 232, 222);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 28, companyY + 2, pageWidth / 2 + 28, companyY + 2);

  doc.setTextColor(0, 0, 0);
  return companyY + 12;
};

// Patch: On app start, fire off loading the logo and put it in window._PDF_LOGO_CACHE
if (typeof window !== "undefined") {
  interface ExtendedWindow extends Window {
    _PDF_LOGO_CACHE?: string | null;
  }
  const extWindow = window as ExtendedWindow;
  
  if (!extWindow._PDF_LOGO_CACHE) {
    getImageDataUrl(logoUrl)
      .then((data) => {
        extWindow._PDF_LOGO_CACHE = data;
      })
      .catch(() => {
        extWindow._PDF_LOGO_CACHE = null;
      });
  }
}
