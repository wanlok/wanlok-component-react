import { LayoutMenu } from "../components/LayoutMenu";
import { Landing } from "../pages/landing";
import { DiscussionPage } from "../pages/discussion";
import { ComponentPage } from "../pages/ComponentPage";
import { PDFPage } from "../pages/pdf";
import { CollectionPage } from "../pages/collection";
import WANLOKImage from "../assets/images/wanlok.png";
import WANLOKImage2 from "../assets/images/wanlok_2.png";
import FolderIcon from "../assets/images/icons/folder.png";
import FolderSelectedIcon from "../assets/images/icons/folder_selected.png";
import DiscussionIcon from "../assets/images/icons/discussion.png";
import DiscussionSelectedIcon from "../assets/images/icons/discussion_selected.png";
import { Kanban } from "../pages/kanban";
import { BanknoteAPI } from "../pages/api/BanknoteAPI";
import { MapperPage } from "../pages/mapper";

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
        icon: FolderIcon,
        icon_selected: FolderSelectedIcon,
        name: "Kanban",
        path: "/kanban/:id?",
        element: <Kanban />
      },
      {
        icon: FolderIcon,
        icon_selected: FolderSelectedIcon,
        name: "Collections",
        path: "/collections/:id?",
        element: <CollectionPage />
      },
      {
        icon: FolderIcon,
        icon_selected: FolderSelectedIcon,
        name: "Mapper",
        path: "/mapper/:id?",
        element: <MapperPage />
      },
      {
        icon: DiscussionIcon,
        icon_selected: DiscussionSelectedIcon,
        name: "Discussion",
        path: "/discussion",
        element: <DiscussionPage />
      },
      {
        icon: FolderIcon,
        icon_selected: FolderSelectedIcon,
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
