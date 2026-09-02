import { ReactNode, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { theme } from "./configs/theme";

const queryClient = new QueryClient();

export const mountApp = (children: ReactNode) => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};
