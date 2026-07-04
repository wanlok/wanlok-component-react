import { Box, Stack, Typography } from "@mui/material";
import { KanbanProject } from "../../services/Types";
import { getDisplayDateTimeString } from "../../common/DateUtils";

import { ViewKanban as KanbanIcon, ViewKanbanOutlined as KanbanOutlinedIcon } from "@mui/icons-material";
import UpIcon from "../../assets/images/icons/up.png";
import DownIcon from "../../assets/images/icons/down.png";

export const ProjectRow = ({
  project,
  selectedProject,
  panelOpened
}: {
  project?: KanbanProject;
  selectedProject?: KanbanProject;
  panelOpened?: boolean;
}) => {
  const mobileRow = panelOpened === true || panelOpened === false;
  return (
    <Stack
      sx={{
        flexDirection: "row",
        py: 2,
        pl: 2,
        pr: mobileRow ? 2 : 0,
        gap: 2,
        boxSizing: "border-box",
        backgroundColor: mobileRow ? "background.default" : "transparent"
      }}
    >
      {project && project.id === selectedProject?.id ? (
        <KanbanIcon style={{ fontSize: "24px" }} />
      ) : (
        <KanbanOutlinedIcon style={{ fontSize: "24px" }} />
      )}
      <Stack sx={{ flex: 1, gap: 1, pr: 2 }}>
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
      </Stack>
      {mobileRow && (
        <Box
          component="img"
          src={panelOpened ? UpIcon : DownIcon}
          alt=""
          sx={{ width: "16px", height: "16px", mt: "4px" }}
        />
      )}
    </Stack>
  );
};
