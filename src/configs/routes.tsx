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
import FolderIcon from "../assets/images/icons/folder.png";
import FolderSelectedIcon from "../assets/images/icons/folder_selected.png";
import DiscussionIcon from "../assets/images/icons/discussion.png";
import DiscussionSelectedIcon from "../assets/images/icons/discussion_selected.png";
import MapIcon from "../assets/images/icons/map.png";
import MapSelectedIcon from "../assets/images/icons/map_selected.png";
import SnapshotIcon from "../assets/images/icons/snapshot.png";
import SnapshotSelectedIcon from "../assets/images/icons/snapshot_selected.png";
import ImageIcon from "../assets/images/icons/image.png";
import ImageSelectedIcon from "../assets/images/icons/image_selected.png";

export const routes = [
  {
    path: "/",
    element: <LayoutMenu />,
    children: [
      {
        icon: WANLOKImage,
        icon_selected: WANLOKImage,
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
        icon: FolderIcon,
        icon_selected: FolderSelectedIcon,
        name: "Bookmarks",
        path: "/bookmarks",
        element: <Bookmarks />,
        children: [{ path: ":id", element: <SnapshotPage /> }]
      },
      {
        icon: DiscussionIcon,
        icon_selected: DiscussionSelectedIcon,
        name: "Discussion",
        path: "/discussion",
        element: <DiscussionPage />
      },
      {
        icon: MapIcon,
        icon_selected: MapSelectedIcon,
        name: "Maps",
        path: "/hong-kong-building-map",
        element: <HongKongBuildingMap />
      },
      {
        icon: FolderIcon,
        icon_selected: FolderSelectedIcon,
        name: "Chart",
        path: "/chart",
        element: <Chart />
      },
      {
        icon: SnapshotIcon,
        icon_selected: SnapshotSelectedIcon,
        name: "Snapshot",
        path: "/snapshot",
        element: <SnapshotPage />,
        children: [{ path: ":id", element: <SnapshotPage /> }]
      },
      {
        icon: ImageIcon,
        icon_selected: ImageSelectedIcon,
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
        icon: FolderIcon,
        icon_selected: FolderSelectedIcon,
        name: "", // TODO: remove this name later
        path: ":id",
        element: <PDFPage />
      }
    ]
  }
];
