import Main from "./layout/Main";
import Landing from "./page/Landing";
import Map from "./page/Map";
import Chart from "./page/Chart";
import General from "./page/General";

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
