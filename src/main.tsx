import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./components/grocary/context/AppContext";

// 1. Get the root DOM element. This can be null.
const rootElement = document.getElementById("root");

// 2. Check if the element exists to prevent a runtime error.
if (rootElement) {
  // 3. Create a root and render the application.
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        {/* 4. Wrap the entire app with the AppContextProvider */}
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </BrowserRouter>
    </StrictMode>
  );
} else {
  // 5. Throw a clear error if the element is not found.
  throw new Error("Failed to find the root element with ID 'root'.");
}