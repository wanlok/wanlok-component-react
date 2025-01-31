import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import "./index.css";
import routes from "./configs/routes";
import theme from "./configs/theme";
import { ThemeProvider } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={createHashRouter(routes)} />
    </ThemeProvider>
  </React.StrictMode>
);
