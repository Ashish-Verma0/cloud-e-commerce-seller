import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../public/css/tailwind.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <MaterialTailwindControllerProvider>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </MaterialTailwindControllerProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  </QueryClientProvider>
);
