import { useState } from "react";
import { useKanban } from "./useKanban";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectRow } from "./ProjectRow";
import { ProjectModal } from "./ProjectModal";
import { KanbanHeader } from "./KanbanHeader";
import { KanbanLayout } from "./KanbanLayout";

export const Kanban = () => {
  const { kanban, selectedProject, addProject, openProject, addItem, moveItem } = useKanban();
  const [panelOpened, setPanelOpened] = useState(false);
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
          <ProjectHeader onCreateButtonClick={() => setOpened(true)} />
          <WCardList
            items={kanban?.projects ?? []}
            renderContent={(project) => <ProjectRow project={project} selectedProject={selectedProject} />}
            onContentClick={(project) => {
              openProject(project);
              setPanelOpened(false);
            }}
            renderRightContent={() => <></>}
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
      <KanbanLayout project={selectedProject} onDragStop={moveItem} />
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
