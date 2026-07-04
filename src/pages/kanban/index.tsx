import { useState } from "react";
import { getDisplayDateTimeString } from "../../common/DateUtils";
import { useKanban } from "./useKanban";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";
import { KanbanColumn } from "../../services/Types";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectModal } from "./ProjectModal";
import { KanbanHeader } from "./KanbanHeader";
import { KanbanLayout } from "./KanbanLayout";
import { WIconButton } from "../../components/WButton";

import {
  Close as CloseIcon,
  ViewKanban as KanbanIcon,
  ViewKanbanOutlined as KanbanOutlinedIcon
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { PanelRow } from "../../components/PanelRow";
import { ItemModal } from "./ItemModal";

export const Kanban = () => {
  const {
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

  const onCreateButtonClick = () => {
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
          <ProjectHeader
            controlGroupState={controlGroupState}
            onCreateButtonClick={onCreateButtonClick}
            onDeleteButtonClick={() => setControlGroupState(controlGroupState === 1 ? 0 : 1)}
          />
          <WCardList
            items={kanban?.projects ?? []}
            renderContent={(project) => {
              const Icon = project.id === selectedProject?.id ? KanbanIcon : KanbanOutlinedIcon;
              return (
              <PanelRow
                icon={<Icon sx={{ fontSize: 24 }} />}
                title={project.name}
              >
                <Typography variant="body1">
                  {getDisplayDateTimeString(new Date(project.created_at))},{" "}
                  {project.columns.reduce(
                    (total: number, column: KanbanColumn) => total + column.items.length,
                    0
                  )}
                </Typography>
              </PanelRow>
              );
            }}
            onContentClick={(project) => {
              openProject(project);
              setPanelOpened(false);
            }}
            renderRightContent={(project) => (
              <Stack>
                {controlGroupState === 1 && (
                  <WIconButton icon={<CloseIcon />} iconSize={16} onClick={() => deleteProject(project)} />
                )}
              </Stack>
            )}
          />
        </>
      }
      topChildren={<PanelRow icon={<KanbanIcon sx={{ fontSize: 24 }} />} title={selectedProject?.name ?? ""} />}
    >
      <KanbanHeader
        project={selectedProject}
        onEditButtonClick={onEditButtonClick}
        onAddItemButtonClick={addItem}
        onDeleteItemButtonClick={() => setControlGroupState(controlGroupState === 2 ? 0 : 2)}
      />
      <KanbanLayout
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
