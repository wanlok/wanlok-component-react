import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import routes from "./routes";
import { Auth0Provider } from "@auth0/auth0-react";

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
            <RouterProvider router={createBrowserRouter(routes)} />
        </Auth0Provider>
    </React.StrictMode>
);
