import { useState } from "react";
import { useKanban } from "./useKanban";
import { LayoutPanel } from "../../components/LayoutPanel";
import { ProjectModal } from "./ProjectModal";
import { DeleteConfirmationModal } from "../../components/DeleteConfirmationModal";
import { RightHeader } from "./RightHeader";
import { RightContent } from "./RightContent";
import { ViewKanban as KanbanIcon } from "@mui/icons-material";
import { PanelRow } from "../../components/PanelRow";
import { ItemModal } from "./ItemModal";
import { LeftContent } from "./LeftContent";
import { LeftHeader } from "./LeftHeader";
import { KanbanProject } from "../../services/Types";

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
    moveItem,
    refreshKanban,
    addMessage,
    deleteMessage
  } = useKanban();
  const [controlGroupState, setControlGroupState] = useState(0);
  const [panelOpened, setPanelOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ i: number; j: number } | null>(null);
  const [opened, setOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<KanbanProject | undefined>(undefined);

  const onAddButtonClick = () => {
    setIsEditing(false);
    setOpened(true);
  };

  const onEditButtonClick = () => {
    if (!selectedProject) {
      return;
    }
    setIsEditing(true);
    setOpened(true);
  };

  const onDeleteProjectButtonClick = (project: KanbanProject) => {
    setProjectToDelete(project);
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
            openProject={(project) => {
              openProject(project);
              setControlGroupState(0);
            }}
            onDeleteProjectButtonClick={onDeleteProjectButtonClick}
          />
        </>
      }
      topChildren={<PanelRow icon={<KanbanIcon sx={{ fontSize: 24 }} />} title={selectedProject?.name ?? ""} />}
    >
      <RightHeader
        isLoading={isLoading}
        project={selectedProject}
        controlGroupState={controlGroupState}
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
          onMoveItem={(targetColumnIndex) => {
            const kanbanItem = selectedProject.columns[selectedItem.i].items[selectedItem.j];
            const newTargetItemIndex = selectedProject.columns[targetColumnIndex].items.length;
            const columns = selectedProject.columns.map((column, i) => {
              if (i === selectedItem.i) {
                return { ...column, items: column.items.filter((_, j) => j !== selectedItem.j) };
              }
              if (i === targetColumnIndex) {
                return { ...column, items: [...column.items, kanbanItem] };
              }
              return column;
            });
            moveItem(columns);
            setSelectedItem({ i: targetColumnIndex, j: newTargetItemIndex });
          }}
          onRefresh={refreshKanban}
          onAddMessage={(name, text) => addMessage(selectedItem.i, selectedItem.j, name, text)}
          onDeleteMessage={(messageIndex) => deleteMessage(selectedItem.i, selectedItem.j, messageIndex)}
          onClose={() => setSelectedItem(null)}
        />
      )}
      <ProjectModal
        key={`project-modal-${opened ? (isEditing ? (selectedProject?.id ?? "edit") : "new") : "closed"}`}
        open={opened}
        onClose={() => setOpened(false)}
        project={isEditing ? selectedProject : undefined}
        onSaveButtonClick={(name, columns) => {
          if (isEditing) {
            updateProject(name, columns);
          } else {
            addProject(name, columns);
          }
          setOpened(false);
        }}
      />
      <DeleteConfirmationModal
        open={Boolean(projectToDelete)}
        title="Delete Project"
        name={projectToDelete?.name}
        onClose={() => setProjectToDelete(undefined)}
        onConfirm={() => {
          if (projectToDelete) {
            deleteProject(projectToDelete);
            setControlGroupState(0);
          }
        }}
      />
    </LayoutPanel>
  );
};
