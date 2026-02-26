import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress browser extension errors (e.g. MetaMask) before React mounts
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason?.message || String(event.reason || "");
  if (reason.includes("MetaMask") || reason.includes("chrome-extension://")) {
    event.preventDefault();
    console.warn("Browser extension error suppressed:", reason);
  }
});

createRoot(document.getElementById("root")!).render(<App />);
