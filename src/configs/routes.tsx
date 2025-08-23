import { LayoutMenu } from "../components/LayoutMenu";
import { Landing } from "../pages/landing";
import { DiscussionPage } from "../pages/discussion";
import { HongKongBuildingMap } from "../pages/hong-kong-building-map";
import { Chart } from "../pages/chart";
import { SnapshotPage } from "../pages/snapshot";
import { PDFPage } from "../pages/pdf";
import { Image } from "../pages/image";
import { Bookmarks } from "../pages/bookmark";
import WANLOKImage from "../assets/images/wanlok.png";
import DiscussionImage from "../assets/images/icons/discussion.png";
import MapImage from "../assets/images/icons/map.png";
import SnapshotImage from "../assets/images/icons/snapshot.png";
import ImageImage from "../assets/images/icons/image.png";
import FolderIcon from "../assets/images/icons/folder.png";

export const routes = [
  {
    path: "/",
    element: <LayoutMenu />,
    children: [
      {
        image: WANLOKImage,
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
        image: FolderIcon,
        name: "Bookmarks",
        path: "/bookmarks",
        element: <Bookmarks />
      },
      {
        image: DiscussionImage,
        name: "Discussion",
        path: "/discussion",
        element: <DiscussionPage />
      },
      {
        image: MapImage,
        name: "Maps",
        path: "/hong-kong-building-map",
        element: <HongKongBuildingMap />
      },
      {
        image: FolderIcon,
        name: "Chart",
        path: "/chart",
        element: <Chart />
      },
      {
        image: SnapshotImage,
        name: "Snapshot",
        path: "/snapshot",
        element: <SnapshotPage />,
        children: [{ path: ":id", element: <SnapshotPage /> }]
      },
      {
        image: ImageImage,
        name: "Image",
        path: "/image",
        element: <Image />
      }
    ]
  },
  {
    path: "/pdf",
    element: <PDFPage />,
    children: [
      {
        image: FolderIcon,
        name: "", // TODO: remove this name later
        path: ":id",
        element: <PDFPage />
      }
    ]
  }
];
