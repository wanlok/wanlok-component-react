import { LayoutMenu } from "../components/LayoutMenu";
import { Landing } from "../pages/landing";
import { DiscussionPage } from "../pages/discussion";
import { ComponentPage } from "../pages/ComponentPage";
import { CollectionPage } from "../pages/collection";
import WANLOKImage from "../assets/images/wanlok.png";
import WANLOKImage2 from "../assets/images/wanlok_2.png";
import {
  Folder as FolderIcon,
  FolderOutlined as FolderOutlinedIcon,
  ViewKanban as KanbanIcon,
  ViewKanbanOutlined as KanbanOutlinedIcon
} from "@mui/icons-material";
import DiscussionIcon from "../assets/images/icons/discussion.png";
import DiscussionSelectedIcon from "../assets/images/icons/discussion_selected.png";
import { Kanban } from "../pages/kanban";
import { BanknoteAPI } from "../pages/api/BanknoteAPI";

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
        icon: <KanbanOutlinedIcon sx={{ fontSize: 36 }} />,
        icon_selected: <KanbanIcon sx={{ fontSize: 36 }} />,
        name: "Kanban",
        path: "/kanban/:id?",
        element: <Kanban />
      },
      {
        icon: <FolderOutlinedIcon sx={{ fontSize: 32 }} />,
        icon_selected: <FolderIcon sx={{ fontSize: 32 }} />,
        name: "Collections",
        path: "/collections/:id?",
        element: <CollectionPage />
      },
      {
        icon: DiscussionIcon,
        icon_selected: DiscussionSelectedIcon,
        name: "Discussion",
        path: "/discussion",
        element: <DiscussionPage />
      },
      {
        icon: <FolderOutlinedIcon sx={{ fontSize: 32 }} />,
        icon_selected: <FolderIcon sx={{ fontSize: 32 }} />,
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
