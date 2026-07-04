import { useState } from "react";
import { folders, useComponentFolder } from "./useComponentFolder";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";
import { Folder as FolderIcon, FolderOutlined as FolderOutlinedIcon } from "@mui/icons-material";
import { PanelRow } from "../../components/PanelRow";
import { Puzzle } from "./Puzzle";

const iconSize = 24;

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
            renderContent={(folder) => {
              const Icon = folder === selectedFolder ? FolderIcon : FolderOutlinedIcon;
              return <PanelRow icon={<Icon sx={{ fontSize: iconSize }} />} title={folder.name} />;
            }}
            onContentClick={(folder) => {
              openFolder(folder);
              setPanelOpened(false);
            }}
            renderRightContent={() => <></>}
          />
        </>
      }
      topChildren={
        selectedFolder ? <PanelRow icon={<FolderIcon sx={{ fontSize: 24 }} />} title={selectedFolder.name} /> : <></>
      }
    >
      {selectedFolder?.id === "puzzle" && <Puzzle />}
    </LayoutPanel>
  );
};
