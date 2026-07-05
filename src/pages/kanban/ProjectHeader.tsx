import { Stack, Typography } from "@mui/material";
import { bottomSx, LayoutHeader, topSx } from "../../components/LayoutHeader";
import { WButton } from "../../components/WButton";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";

export const ProjectHeader = ({
  controlGroupState,
  onAddButtonClick,
  onDeleteButtonClick
}: {
  controlGroupState: number;
  onAddButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  return (
    <LayoutHeader
      top={
        <Stack sx={[topSx, { alignItems: "center", px: 2 }]}>
          <Typography variant="body1">Kanban</Typography>
        </Stack>
      }
      bottom={
        <Stack sx={[bottomSx, { gap: "1px" }]}>
          <WButton
            onClick={onAddButtonClick}
            sx={{ backgroundColor: "primary.main" }}
            rightIcon={<AddIcon sx={{ fontSize: 24 }} />}
          >
            Add
          </WButton>
          <WButton
            onClick={onDeleteButtonClick}
            sx={{ backgroundColor: controlGroupState === 1 ? "primary.dark" : "primary.main" }}
            rightIcon={<CloseIcon sx={{ fontSize: 24 }} />}
          >
            Delete
          </WButton>
        </Stack>
      }
    />
  );
};
