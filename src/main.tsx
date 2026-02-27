import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress browser extension errors (e.g. MetaMask) before React mounts
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason?.message || String(event.reason || "");
  const stack = event.reason?.stack || "";
  if (
    reason.includes("MetaMask") ||
    reason.includes("chrome-extension://") ||
    stack.includes("chrome-extension://") ||
    stack.includes("inpage.js")
  ) {
    event.preventDefault();
    console.warn("Browser extension error suppressed:", reason);
  }
});

window.addEventListener("error", (event) => {
  const src = event.filename || "";
  const msg = event.message || "";
  if (src.includes("chrome-extension://") || msg.includes("MetaMask")) {
    event.preventDefault();
    console.warn("Browser extension error suppressed:", msg);
  }
});

createRoot(document.getElementById("root")!).render(<App />);
