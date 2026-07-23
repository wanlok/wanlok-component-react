import { LayoutMenu } from "../components/LayoutMenu";
import { Landing } from "../pages/landing";
import { Playground } from "../pages/playground";
import { CollectionPage } from "../pages/collection";
import WANLOKImage from "../assets/images/wanlok.png";
import WANLOKImage2 from "../assets/images/wanlok_2.png";
import {
  BugReport as BugReportIcon,
  BugReportOutlined as BugReportOutlinedIcon,
  Folder as FolderIcon,
  FolderOutlined as FolderOutlinedIcon,
  ViewKanban as KanbanIcon,
  ViewKanbanOutlined as KanbanOutlinedIcon
} from "@mui/icons-material";
import { Kanban } from "../pages/kanban";
import { CollectionAPI } from "../pages/api/CollectionAPI";

const iconSize = 32;

export const routes = [
  {
    path: "/",
    element: <LayoutMenu />,
    children: [
      {
        icon: WANLOKImage,
        icon_selected: WANLOKImage2,
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
        icon: <KanbanOutlinedIcon sx={{ fontSize: iconSize }} />,
        icon_selected: <KanbanIcon sx={{ fontSize: iconSize }} />,
        name: "Kanban",
        path: "/kanban/:id?",
        element: <Kanban />
      },
      {
        icon: <FolderOutlinedIcon sx={{ fontSize: iconSize }} />,
        icon_selected: <FolderIcon sx={{ fontSize: iconSize }} />,
        name: "Collections",
        path: "/collections/:id?",
        element: <CollectionPage />
      },
      {
        icon: <BugReportOutlinedIcon sx={{ fontSize: iconSize }} />,
        icon_selected: <BugReportIcon sx={{ fontSize: iconSize }} />,
        name: "Playground",
        path: "/components/:id?",
        element: <Playground />
        // children: [{ path: "/snapshot/:id2", element: <Playground /> }]
      }
    ]
  },
  {
    path: "/api/collections/:id",
    element: <CollectionAPI />
  }
];
