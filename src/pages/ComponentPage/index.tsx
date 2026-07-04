import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { ComponentFolder, folders, useComponentFolder } from "./useComponentFolder";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";

import {
  Folder as FolderIcon,
  FolderOutlined as FolderOutlinedIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from "@mui/icons-material";
import { Puzzle } from "./Puzzle";

const FolderRow = ({
  folder,
  selectedFolder,
  panelOpened
}: {
  folder: ComponentFolder;
  selectedFolder?: ComponentFolder;
  panelOpened?: boolean;
}) => {
  const mobileRow = panelOpened === true || panelOpened === false;
  return (
    <Stack
      sx={{
        flexDirection: "row",
        alignItems: "center",
        py: 2,
        pl: 2,
        pr: mobileRow ? 2 : 0,
        gap: 2,
        boxSizing: "border-box",
        backgroundColor: mobileRow ? "background.default" : "transparent"
      }}
    >
      {folder === selectedFolder ? (
        <FolderIcon style={{ fontSize: "24px" }} />
      ) : (
        <FolderOutlinedIcon style={{ fontSize: "24px" }} />
      )}
      <Stack sx={{ flex: 1, gap: 1, pr: 2 }}>
        <Typography variant="body1">{folder.name}</Typography>
      </Stack>
      {mobileRow &&
        (panelOpened ? <KeyboardArrowUpIcon sx={{ fontSize: 24 }} /> : <KeyboardArrowDownIcon sx={{ fontSize: 24 }} />)}
    </Stack>
  );
};

export const ComponentPage = () => {
  const { selectedFolder, openFolder } = useComponentFolder();
  const [panelOpened, setPanelOpened] = useState<boolean>(false);
  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <WCardList
            items={folders}
            renderContent={(folder) => <FolderRow folder={folder} selectedFolder={selectedFolder} />}
            onContentClick={(folder) => {
              openFolder(folder);
              setPanelOpened(false);
            }}
            renderRightContent={() => <></>}
          />
        </>
      }
      topChildren={
        selectedFolder ? (
          <FolderRow folder={selectedFolder} selectedFolder={selectedFolder} panelOpened={panelOpened} />
        ) : (
          <></>
        )
      }
    >
      {selectedFolder?.id === "puzzle" && <Puzzle />}
    </LayoutPanel>
  );
};
