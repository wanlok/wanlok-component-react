import { useState } from "react";
import { Typography } from "@mui/material";
import { ComponentFolder, folders, useComponentFolder } from "./useComponentFolder";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";
import { Folder as FolderIcon, FolderOutlined as FolderOutlinedIcon } from "@mui/icons-material";
import { PanelRow } from "../../components/PanelRow";
import { Puzzle } from "./Puzzle";

const FolderRow = ({ folder, selectedFolder }: { folder: ComponentFolder; selectedFolder?: ComponentFolder }) => {
  return (
    <PanelRow
      icon={
        folder === selectedFolder ? <FolderIcon sx={{ fontSize: 24 }} /> : <FolderOutlinedIcon sx={{ fontSize: 24 }} />
      }
    >
      <Typography variant="body1">{folder.name}</Typography>
    </PanelRow>
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
      topChildren={selectedFolder ? <FolderRow folder={selectedFolder} selectedFolder={selectedFolder} /> : <></>}
    >
      {selectedFolder?.id === "puzzle" && <Puzzle />}
    </LayoutPanel>
  );
};
