import { LayoutMenu } from "../components/LayoutMenu";
import { Landing } from "../pages/landing";
import { DiscussionPage } from "../pages/discussion";
import { ComponentPage } from "../pages/ComponentPage";
import { CollectionPage } from "../pages/collection";
import WANLOKImage from "../assets/images/wanlok.png";
import WANLOKImage2 from "../assets/images/wanlok_2.png";
import {
  Chat as ChatIcon,
  ChatOutlined as ChatOutlinedIcon,
  Folder as FolderIcon,
  FolderOutlined as FolderOutlinedIcon,
  ViewKanban as KanbanIcon,
  ViewKanbanOutlined as KanbanOutlinedIcon
} from "@mui/icons-material";
import { Kanban } from "../pages/kanban";
import { BanknoteAPI } from "../pages/api/BanknoteAPI";

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
        icon: <ChatOutlinedIcon sx={{ fontSize: iconSize }} />,
        icon_selected: <ChatIcon sx={{ fontSize: iconSize }} />,
        name: "Discussion",
        path: "/discussion",
        element: <DiscussionPage />
      },
      {
        icon: <FolderOutlinedIcon sx={{ fontSize: iconSize }} />,
        icon_selected: <FolderIcon sx={{ fontSize: iconSize }} />,
        name: "Components",
        path: "/components/:id?",
        element: <ComponentPage />
        // children: [{ path: "/snapshot/:id2", element: <ComponentPage /> }]
      }
    ]
  },
  {
    path: "/api/banknotes",
    element: <BanknoteAPI />
  }
];
