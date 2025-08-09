import Main from "../layouts/Main";
import General from "../pages/general";
import Landing from "../pages/landing";
import HongKongBuildingMap from "../pages/hong-kong-building-map";
import Chart from "../pages/chart";

const routes = [
  {
    path: "/",
    element: <Main />,
    children: [
      {
        name: "Home",
        path: "/",
        element: <Landing />
        // loader: postsLoader,
        // children: [
        // { path: "/create-post", element: <NewPost />, action: newPostAction },
        // { path: "/:id", element: <PostDetails />, loader: postDetailsLoader },
        //   { path: "/", element: <Landing /> },
        // ],
      },
      {
        name: "General",
        path: "/general",
        element: <General />
      },
      {
        name: "Hong Kong Building Map",
        path: "/hong-kong-building-map",
        element: <HongKongBuildingMap />
      },
      {
        name: "Chart",
        path: "/chart",
        element: <Chart />
      }
    ]
  }
];

export default routes;
