import { useState } from "react";
import { folders, usePlayground } from "./usePlayground";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";
import { BugReport as BugReportIcon, BugReportOutlined as BugReportOutlinedIcon } from "@mui/icons-material";
import { PanelRow } from "../../components/PanelRow";
import { Puzzle } from "./puzzle";
import { Quiz } from "./quiz";
import { LeftHeader } from "./LeftHeader";

const iconSize = 24;

export const Playground = () => {
  const { selectedFolder, openFolder } = usePlayground();
  const [panelOpened, setPanelOpened] = useState<boolean>(false);
  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <LeftHeader />
          <WCardList
            items={folders}
            renderContent={(folder) => {
              const Icon = folder === selectedFolder ? BugReportIcon : BugReportOutlinedIcon;
              return <PanelRow icon={<Icon sx={{ fontSize: iconSize }} />} title={folder.name} />;
            }}
            onContentClick={(folder) => {
              if (folder) {
                openFolder(folder);
              }
              setPanelOpened(false);
            }}
            renderRightContent={() => <></>}
          />
        </>
      }
      topChildren={
        selectedFolder ? <PanelRow icon={<BugReportIcon sx={{ fontSize: 24 }} />} title={selectedFolder.name} /> : <></>
      }
    >
      {selectedFolder?.id === "puzzle" && <Puzzle />}
      {selectedFolder?.id === "quiz" && <Quiz />}
    </LayoutPanel>
  );
};
