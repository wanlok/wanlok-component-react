import { Stack, Typography } from "@mui/material";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";
import { WIconButton } from "../../components/WButton";

import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";

export const ProjectHeader = ({
  controlGroupState,
  onCreateButtonClick,
  onDeleteButtonClick
}: {
  controlGroupState: number;
  onCreateButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  return (
    <LayoutHeader
      top={
        <Stack sx={[topSx, { px: 1 }]}>
          <Typography variant="body1">Kanban</Typography>
        </Stack>
      }
      bottom={
        <Stack sx={{ flexDirection: "row", gap: "1px" }}>
          <WIconButton
            icon={<AddIcon sx={{ fontSize: 26 }} />}
            iconSize={16}
            onClick={onCreateButtonClick}
            sx={{ backgroundColor: "primary.main" }}
          />
          <WIconButton
            icon={<CloseIcon />}
            iconSize={16}
            onClick={onDeleteButtonClick}
            sx={{ backgroundColor: controlGroupState === 1 ? "primary.dark" : "primary.main" }}
          />
        </Stack>
      }
    />
  );
};
