import { useState } from "react";
import { useKanban } from "./useKanban";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectRow } from "./ProjectRow";
import { ProjectModal } from "./ProjectModal";
import { KanbanHeader } from "./KanbanHeader";
import { KanbanLayout } from "./KanbanLayout";
import { WIconButton } from "../../components/WButton";

import CrossIcon from "../../assets/images/icons/cross.png";
import { Stack } from "@mui/material";
import { KanbanItemModal } from "./KanbanItemModal";

export const Kanban = () => {
  const { kanban, selectedProject, addProject, deleteProject, openProject, addItem, moveItem } = useKanban();
  const [controlGroupState, setControlGroupState] = useState(0);
  const [panelOpened, setPanelOpened] = useState(false);
  const [kanbanItemModalOpened, setKanbanItemModalOpened] = useState(false);
  const [opened, setOpened] = useState(false);

  const [projectModalRows, setProjectModalRows] = useState([
    { label: "Name", value: "" },
    { label: "Columns", value: ["To Do", "In Progress", "Ready To Deploy", "Done"] }
  ]);

  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <ProjectHeader
            controlGroupState={controlGroupState}
            onCreateButtonClick={() => setOpened(true)}
            onDeleteButtonClick={() => setControlGroupState(controlGroupState === 1 ? 0 : 1)}
          />
          <WCardList
            items={kanban?.projects ?? []}
            renderContent={(project) => <ProjectRow project={project} selectedProject={selectedProject} />}
            onContentClick={(project) => {
              openProject(project);
              setPanelOpened(false);
            }}
            renderRightContent={(project) => (
              <Stack>
                {controlGroupState === 1 && (
                  <WIconButton icon={CrossIcon} iconSize={16} onClick={() => deleteProject(project)} />
                )}
              </Stack>
            )}
          />
        </>
      }
      topChildren={
        selectedProject ? (
          <ProjectRow project={selectedProject} selectedProject={selectedProject} panelOpened={panelOpened} />
        ) : (
          <></>
        )
      }
    >
      <KanbanHeader project={selectedProject} onAddItemButtonClick={addItem} />
      <KanbanLayout
        project={selectedProject}
        onDragStop={moveItem}
        onClick={(i, j) => {
          console.log("clicked", i, j);
          setKanbanItemModalOpened(true);
        }}
      />
      <KanbanItemModal open={kanbanItemModalOpened} onClose={() => setKanbanItemModalOpened(false)} />
      <ProjectModal
        open={opened}
        onClose={() => setOpened(false)}
        rows={projectModalRows}
        onRowValueChange={(i, value) => {
          const newProjectModalRows = [...projectModalRows];
          newProjectModalRows[i].value = value;
          setProjectModalRows(newProjectModalRows);
        }}
        onSaveButtonClick={() => {
          const name = projectModalRows[0].value as string;
          const columns = projectModalRows[1].value as string[];
          addProject(name, columns);
          projectModalRows[0].value = "";
          setOpened(false);
        }}
      />
    </LayoutPanel>
  );
};
