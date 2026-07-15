import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { App } from "./app/App";
import { queryClient } from "./app/queryClient";
import { AppErrorBoundary } from "./components/feedback/AppErrorBoundary";
import "./styles/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element was not found");

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
);
