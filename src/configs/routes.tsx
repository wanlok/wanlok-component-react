import Main from "../layout/Main";
import General, { loader as generalLoader } from "../page/general";
import Landing from "../page/landing";
import HongKongBuildingMap from "../page/hong-kong-building-map";
import Chart from "../page/chart";
import T20250212 from "../page/T20250212";

export default [
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
        element: <General />,
        loader: generalLoader
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
      },
      {
        name: "20250212",
        path: "/20250212",
        element: <T20250212 />
      }
    ]
  }
];
