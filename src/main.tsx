
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to check if the URL has the "showButtonIds" parameter
const checkForButtonIdsMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  window.showButtonIds = urlParams.has('showButtonIds');
};

// Call the function when the app starts
checkForButtonIdsMode();

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found");
}

// Add the missing type definition for the global window object
declare global {
  interface Window {
    showButtonIds?: boolean;
  }
}
