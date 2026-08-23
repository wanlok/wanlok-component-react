import { LayoutMenu } from "../components/LayoutMenu";
import { Landing } from "../pages/landing";
import { Playground } from "../pages/playground";
import { CollectionPage } from "../pages/collection";
import WANLOKImage from "../assets/images/wanlok.png";
import WANLOKImage2 from "../assets/images/wanlok2.png";
import {
  BugReport as BugReportIcon,
  BugReportOutlined as BugReportOutlinedIcon,
  Folder as FolderIcon,
  FolderOutlined as FolderOutlinedIcon,
  ViewKanban as KanbanIcon,
  ViewKanbanOutlined as KanbanOutlinedIcon
} from "@mui/icons-material";
import { Kanban } from "../pages/kanban";

const iconSize = 32;

export const routes = [
  {
    path: "/",
    element: <LayoutMenu />,
    children: [
      {
        icon: WANLOKImage,
        iconSelected: WANLOKImage2,
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
        iconSelected: <KanbanIcon sx={{ fontSize: iconSize }} />,
        name: "Kanban",
        path: "/kanban/:id?",
        element: <Kanban />
      },
      {
        icon: <FolderOutlinedIcon sx={{ fontSize: iconSize }} />,
        iconSelected: <FolderIcon sx={{ fontSize: iconSize }} />,
        name: "Collections",
        path: "/collections/:id?/:itemId?/:page?",
        element: <CollectionPage />
      },
      {
        icon: <BugReportOutlinedIcon sx={{ fontSize: iconSize }} />,
        iconSelected: <BugReportIcon sx={{ fontSize: iconSize }} />,
        name: "Playground",
        path: "/playground/:id?",
        element: <Playground />
        // children: [{ path: "/snapshot/:id2", element: <Playground /> }]
      }
    ]
  }
];
