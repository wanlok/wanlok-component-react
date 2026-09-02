import { createHashRouter, RouterProvider } from "react-router-dom";
import { LayoutMenu } from "../../components/LayoutMenu";
import { Kanban } from "../../pages/kanban";
import { mountApp } from "../../mountApp";

const router = createHashRouter([{ path: "/:id?", element: <Kanban /> }]);

mountApp(
  <LayoutMenu activeSection="kanban">
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </LayoutMenu>
);
