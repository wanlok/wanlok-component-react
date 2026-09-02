import { createHashRouter, RouterProvider } from "react-router-dom";
import { LayoutMenu } from "../../components/LayoutMenu";
import { CollectionPage } from "../../pages/collection";
import { mountApp } from "../../mountApp";

const router = createHashRouter([{ path: "/:id?/:itemId?/:page?", element: <CollectionPage /> }]);

mountApp(
  <LayoutMenu activeSection="collections">
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </LayoutMenu>
);
