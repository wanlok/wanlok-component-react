import Main from "../layout/Main";
import General from "../page/general";
import Landing from "../page/landing";
import HongKongBuildingMap from "../page/hong-kong-building-map";
import Chart from "../page/chart";

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
