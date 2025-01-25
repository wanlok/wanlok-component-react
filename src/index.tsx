import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import routes from "./routes";
import theme from "./theme";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-2rd0c0a0v5s02biz.us.auth0.com"
      clientId="EroccoYBgNTl6OQnX6crkn82HHMInJoF"
      authorizationParams={{
        audience: "https://dev-2rd0c0a0v5s02biz.us.auth0.com/api/v2/",
        redirect_uri: window.location.origin
      }}
      cacheLocation="localstorage"
    >
      <ThemeProvider theme={theme}>
        <RouterProvider router={createBrowserRouter(routes)} />
      </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>
);
