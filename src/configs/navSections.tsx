import { ReactNode } from "react";
import WANLOKImage from "../assets/images/wanlok.png";
import WANLOKImage2 from "../assets/images/wanlok2.png";
import {
  BugReport as BugReportIcon,
  BugReportOutlined as BugReportOutlinedIcon,
  Folder as FolderIcon,
  FolderOutlined as FolderOutlinedIcon,
  MonetizationOn as MonetizationOnIcon,
  MonetizationOnOutlined as MonetizationOnOutlinedIcon,
  ViewKanban as KanbanIcon,
  ViewKanbanOutlined as KanbanOutlinedIcon
} from "@mui/icons-material";

const iconSize = 32;

export type NavSectionId = "home" | "kanban" | "collections" | "prices" | "playground";

interface NavSection {
  id: NavSectionId;
  name?: string;
  href: string;
  icon: string | ReactNode;
  iconSelected: string | ReactNode;
}

export const navSections: NavSection[] = [
  { id: "home", href: "/", icon: WANLOKImage, iconSelected: WANLOKImage2 },
  {
    id: "kanban",
    name: "Kanban",
    href: "/kanban/",
    icon: <KanbanOutlinedIcon sx={{ fontSize: iconSize }} />,
    iconSelected: <KanbanIcon sx={{ fontSize: iconSize }} />
  },
  {
    id: "collections",
    name: "Collections",
    href: "/collections/",
    icon: <FolderOutlinedIcon sx={{ fontSize: iconSize }} />,
    iconSelected: <FolderIcon sx={{ fontSize: iconSize }} />
  },
  {
    id: "prices",
    name: "Prices",
    href: "/prices/",
    icon: <MonetizationOnOutlinedIcon sx={{ fontSize: iconSize }} />,
    iconSelected: <MonetizationOnIcon sx={{ fontSize: iconSize }} />
  },
  {
    id: "playground",
    name: "Playground",
    href: "/playground/",
    icon: <BugReportOutlinedIcon sx={{ fontSize: iconSize }} />,
    iconSelected: <BugReportIcon sx={{ fontSize: iconSize }} />
  }
];
