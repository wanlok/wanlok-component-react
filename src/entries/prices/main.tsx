import { createHashRouter, RouterProvider } from "react-router-dom";
import { LayoutMenu } from "../../components/LayoutMenu";
import { Prices } from "../../pages/prices";
import { mountApp } from "../../mountApp";

const router = createHashRouter([{ path: "/:id?", element: <Prices /> }]);

mountApp(
  <LayoutMenu activeSection="prices">
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </LayoutMenu>
);
