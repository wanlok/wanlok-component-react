import { Dispatch, SetStateAction } from "react";
import { Stack, Typography } from "@mui/material";
import { LayoutLoading } from "../../components/LayoutLoading";
import { Close as CloseIcon, ViewKanban as KanbanIcon, ViewKanbanOutlined as KanbanOutlinedIcon } from "@mui/icons-material";
import { Kanban, KanbanColumn, KanbanProject } from "../../services/Types";
import { WCardList } from "../../components/WCardList";
import { iconButtonSx, WButton } from "../../components/WButton";
import { PanelRow } from "../../components/PanelRow";
import { getDisplayDateTimeString } from "../../common/DateUtils";

export const LeftContent = ({
  isLoading,
  kanban,
  selectedProject,
  controlGroupState,
  setPanelOpened,
  openProject,
  deleteProject
}: {
  isLoading: boolean;
  kanban: Kanban | undefined;
  selectedProject: KanbanProject | undefined;
  controlGroupState: number;
  setPanelOpened: Dispatch<SetStateAction<boolean>>;
  openProject: (project: KanbanProject) => void;
  deleteProject: (project: KanbanProject) => Promise<void>;
}) => {
  if (isLoading) {
    return <LayoutLoading />;
  }
  return (
    <WCardList
      items={kanban?.projects ?? []}
      renderContent={(project) => {
        const Icon = project.id === selectedProject?.id ? KanbanIcon : KanbanOutlinedIcon;
        return (
          <PanelRow icon={<Icon sx={{ fontSize: 24 }} />} title={project.name}>
            <Typography variant="body1">
              {getDisplayDateTimeString(new Date(project.created_at))},{" "}
              {project.columns.reduce((total: number, column: KanbanColumn) => total + column.items.length, 0)}
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
            <WButton onClick={() => deleteProject(project)} sx={iconButtonSx}>
              <CloseIcon sx={{ fontSize: 24 }} />
            </WButton>
          )}
        </Stack>
      )}
    />
  );
};
