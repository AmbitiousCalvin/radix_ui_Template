import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LayoutContextProvider } from "./contexts/LayoutContext";
import { ContactContextProvider } from "./contexts/ContactContext";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <LayoutContextProvider>
      <ContactContextProvider>
        <App />
      </ContactContextProvider>
    </LayoutContextProvider>
  </StrictMode>
);
