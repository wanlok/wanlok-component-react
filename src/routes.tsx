import Main from "./layout/Main";
import Landing from "./page/landing";
import Map from "./page/map";
import Chart from "./page/chart";
import General from "./page/general";

export default [
  {
    path: "/",
    element: <Main />,
    children: [
      {
        name: "Home",
        path: "/",
        element: <Landing />,
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
      },
      {
        name: "Map",
        path: "/map",
        element: <Map />,
      },
      {
        name: "Chart",
        path: "/chart",
        element: <Chart />,
      },
    ],
  },
];
