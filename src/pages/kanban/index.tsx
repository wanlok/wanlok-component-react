import { useState } from "react";
import { getDisplayDateTimeString } from "../../common/DateUtils";
import { useKanban } from "./useKanban";
import { LayoutPanel } from "../../components/LayoutPanel";
import { ProjectModal } from "./ProjectModal";
import { RightHeader } from "./RightHeader";
import { RightContent } from "./RightContent";
import { ViewKanban as KanbanIcon } from "@mui/icons-material";
import { PanelRow } from "../../components/PanelRow";
import { ItemModal } from "./ItemModal";
import { LeftContent } from "./LeftContent";
import { LeftHeader } from "./LeftHeader";

export const Kanban = () => {
  const {
    isLoading,
    kanban,
    selectedProject,
    addProject,
    updateProject,
    deleteProject,
    openProject,
    addItem,
    updateItem,
    deleteItem,
    moveItem
  } = useKanban();
  const [controlGroupState, setControlGroupState] = useState(0);
  const [panelOpened, setPanelOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ i: number; j: number } | null>(null);
  const [opened, setOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const defaultProjectModalRows: { label: string; value: string | string[]; disabled?: boolean }[] = [
    { label: "Name", value: "" },
    { label: "Columns", value: ["To Do", "In Progress", "Ready To Deploy", "Done"] }
  ];

  const [projectModalRows, setProjectModalRows] = useState(defaultProjectModalRows);

  const onAddButtonClick = () => {
    setProjectModalRows(defaultProjectModalRows);
    setIsEditing(false);
    setOpened(true);
  };

  const onEditButtonClick = () => {
    if (!selectedProject) {
      return;
    }
    setProjectModalRows([
      { label: "Name", value: selectedProject.name },
      {
        label: "Created Date",
        value: selectedProject.created_at ? getDisplayDateTimeString(new Date(selectedProject.created_at)) : "",
        disabled: true
      },
      { label: "Columns", value: selectedProject.columns.map((column) => column.name) }
    ]);
    setIsEditing(true);
    setOpened(true);
  };

  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <LeftHeader
            isLoading={isLoading}
            controlGroupState={controlGroupState}
            onAddButtonClick={onAddButtonClick}
            onDeleteButtonClick={() => setControlGroupState(controlGroupState === 1 ? 0 : 1)}
          />
          <LeftContent
            isLoading={isLoading}
            kanban={kanban}
            selectedProject={selectedProject}
            controlGroupState={controlGroupState}
            setPanelOpened={setPanelOpened}
            openProject={openProject}
            deleteProject={deleteProject}
          />
        </>
      }
      topChildren={<PanelRow icon={<KanbanIcon sx={{ fontSize: 24 }} />} title={selectedProject?.name ?? ""} />}
    >
      <RightHeader
        isLoading={isLoading}
        project={selectedProject}
        onEditButtonClick={onEditButtonClick}
        onAddItemButtonClick={addItem}
        onDeleteItemButtonClick={() => setControlGroupState(controlGroupState === 2 ? 0 : 2)}
      />
      <RightContent
        isLoading={isLoading}
        project={selectedProject}
        controlGroupState={controlGroupState}
        onDragStop={moveItem}
        onClick={(i, j) => setSelectedItem({ i, j })}
        onDeleteItemClick={(i, j) => deleteItem(i, j)}
      />
      {selectedProject && selectedItem && (
        <ItemModal
          project={selectedProject}
          item={selectedItem}
          onItemChange={(name, content) => updateItem(selectedItem.i, selectedItem.j, name, content)}
          onClose={() => setSelectedItem(null)}
        />
      )}
      <ProjectModal
        open={opened}
        onClose={() => setOpened(false)}
        title={isEditing ? "Edit Project" : "Create Project"}
        rows={projectModalRows}
        onRowValueChange={(i, value) => {
          const newProjectModalRows = [...projectModalRows];
          newProjectModalRows[i].value = value;
          setProjectModalRows(newProjectModalRows);
        }}
        onSaveButtonClick={() => {
          const name = projectModalRows[0].value as string;
          const columns = projectModalRows[projectModalRows.length - 1].value as string[];
          if (isEditing) {
            updateProject(name, columns);
          } else {
            addProject(name, columns);
          }
          setOpened(false);
        }}
      />
    </LayoutPanel>
  );
};
