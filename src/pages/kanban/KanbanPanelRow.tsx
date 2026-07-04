import { Typography } from "@mui/material";
import { KanbanProject } from "../../services/Types";
import { getDisplayDateTimeString } from "../../common/DateUtils";
import { ViewKanban as KanbanIcon, ViewKanbanOutlined as KanbanOutlinedIcon } from "@mui/icons-material";
import { PanelRow } from "../../components/PanelRow";

export const KanbanPanelRow = ({
  project,
  selectedProject
}: {
  project?: KanbanProject;
  selectedProject?: KanbanProject;
}) => {
  return (
    <PanelRow
      icon={
        project && project.id === selectedProject?.id ? (
          <KanbanIcon sx={{ fontSize: 24 }} />
        ) : (
          <KanbanOutlinedIcon sx={{ fontSize: 24 }} />
        )
      }
    >
      <Typography
        variant="body1"
        sx={{
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1
        }}
      >
        {project?.name ?? "No Project Selected"}
      </Typography>
      {project && (
        <Typography variant="body1">
          {getDisplayDateTimeString(new Date(project.created_at))},{" "}
          {project.columns.reduce((total, column) => total + column.items.length, 0)}
        </Typography>
      )}
    </PanelRow>
  );
};
