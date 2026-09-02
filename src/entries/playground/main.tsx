import { createHashRouter, RouterProvider } from "react-router-dom";
import { LayoutMenu } from "../../components/LayoutMenu";
import { Playground } from "../../pages/playground";
import { mountApp } from "../../mountApp";

const router = createHashRouter([{ path: "/:id?", element: <Playground /> }]);

mountApp(
  <LayoutMenu activeSection="playground">
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </LayoutMenu>
);
