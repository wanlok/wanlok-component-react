import { Main } from "../layouts/Main";
import { Landing } from "../pages/landing";
import { DiscussionPage } from "../pages/discussion";
import { HongKongBuildingMap } from "../pages/hong-kong-building-map";
import { Chart } from "../pages/chart";
import { SnapshotPage } from "../pages/snapshot";

export const routes = [
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
        name: "Discussion",
        path: "/discussion",
        element: <DiscussionPage />
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
        path: "/snapshot",
        element: <SnapshotPage />
      },
      {
        name: "Snapshot",
        path: "/snapshot/:id",
        element: <SnapshotPage />
      }
    ]
  }
];
