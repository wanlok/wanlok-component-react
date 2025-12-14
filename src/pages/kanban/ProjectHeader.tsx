import { Stack, Typography } from "@mui/material";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";
import { WIconButton } from "../../components/WButton";

import AddIcon from "../../assets/images/icons/add.png";
import CrossIcon from "../../assets/images/icons/cross.png";
import UploadIcon from "../../assets/images/icons/upload.png";
import DownloadIcon from "../../assets/images/icons/download.png";

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
        <Stack sx={{ flexDirection: "row", gap: 1 }}>
          <Stack sx={{ flexDirection: "row", gap: "1px" }}>
            <WIconButton
              icon={AddIcon}
              iconSize={16}
              onClick={onCreateButtonClick}
              sx={{ backgroundColor: "primary.main" }}
            />
            <WIconButton
              icon={CrossIcon}
              iconSize={16}
              onClick={onDeleteButtonClick}
              sx={{ backgroundColor: controlGroupState === 1 ? "primary.dark" : "primary.main" }}
            />
          </Stack>
          <Stack sx={{ flexDirection: "row", gap: "1px" }}>
            <WIconButton icon={UploadIcon} iconSize={18} onClick={() => {}} sx={{ backgroundColor: "primary.main" }} />
            <WIconButton
              icon={DownloadIcon}
              iconSize={18}
              onClick={() => {}}
              sx={{ backgroundColor: "primary.main" }}
            />
          </Stack>
        </Stack>
      }
    />
  );
};
