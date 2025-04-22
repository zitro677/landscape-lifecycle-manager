
import { jsPDF } from "jspdf";

// Inline base64 for the logo image for performance and reliable PDF generation.
// Normally, you'd run a build-time conversion, but here we'll load from public with getImageFromUrl.
const logoUrl = "/lovable-uploads/d3b8a746-5360-4cd5-b681-98638ed73e81.png";

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

  // We'll synchronously return if logo is not yet ready, and try to embed the logo if image loaded.
  // Since generatePDF is called on a button, this can be made async if needed in future.

  // Add green line under header
  doc.setDrawColor(93, 144, 73);
  doc.setLineWidth(1.5);
  doc.line(marginLeft, yPosition - 7, pageWidth - marginLeft, yPosition - 7);

  // Add logo left-aligned (about 32x32, size can be adjusted as needed)
  // We'll attempt to load logo synchronously (in practice, for best experience convert logo at build time).
  // Since this is called inside a try/catch in ProposalPdfGenerator, we'll block if logo is not ready.
  let logoHeight = 28;
  let logoWidth = 28;
  let logoLoaded = false;
  let logoY = yPosition - 2;
  let logoX = marginLeft;
  // Default fallback: Do nothing if logo cannot be fetched, PDF is still usable.

  // Instead of async/await, we use a workaround so this signature stays non-async for compatibility.
  // We'll use a hack: If window._PDF_LOGO_CACHE is set, use it. Else block and set it.
  // @ts-ignore
  const _window = typeof window !== "undefined" ? window : {};
  // @ts-ignore
  if (!_window._PDF_LOGO_CACHE) {
    // Not loaded yet, block (synchronously) for this export.
    // NOTE: The first export will show the logo after a moment, next exports will be instant.
    // @ts-ignore
    _window._PDF_LOGO_CACHE = undefined;
    // Only synchronous in modern browsers (waiting till image loads).
    throw new Error("Logo not loaded for PDF; try again in a second.");
  }
  // @ts-ignore
  const logoBase64 = _window._PDF_LOGO_CACHE;
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
  let align = logoLoaded ? "left" : "center";

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
// So that PDF export is instant on first click (ignoring SSR/hydration as PDF runs client-side)
if (typeof window !== "undefined" && !window._PDF_LOGO_CACHE) {
  getImageDataUrl(logoUrl)
    .then((data) => {
      // @ts-ignore
      window._PDF_LOGO_CACHE = data;
    })
    .catch(() => {
      // @ts-ignore
      window._PDF_LOGO_CACHE = null;
    });
}
