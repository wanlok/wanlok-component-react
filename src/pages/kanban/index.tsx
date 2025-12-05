import { useState } from "react";
import { folders, useKanban } from "./useKanban";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectRow } from "./ProjectRow";
import { ProjectModal } from "./ProjectModal";
import { KanbanHeader } from "./KanbanHeader";
import { KanbanLayout } from "./KanbanLayout";

export const Kanban = () => {
  const { selectedFolder, openFolder, addItem } = useKanban();
  const [panelOpened, setPanelOpened] = useState(false);
  const [opened, setOpened] = useState(false);
  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <ProjectHeader onCreateButtonClick={() => setOpened(true)} />
          <WCardList
            items={folders}
            renderContent={(folder) => <ProjectRow folder={folder} selectedFolder={selectedFolder} />}
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
          <ProjectRow folder={selectedFolder} selectedFolder={selectedFolder} panelOpened={panelOpened} />
        ) : (
          <></>
        )
      }
    >
      <KanbanHeader selectedFolder={selectedFolder} onAddItemButtonClick={addItem} />
      <KanbanLayout />
      <ProjectModal open={opened} onClose={() => setOpened(false)} />
    </LayoutPanel>
  );
};
