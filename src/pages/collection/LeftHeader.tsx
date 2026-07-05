import { Stack, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { WButton } from "../../components/WButton";
import { bottomSx, LayoutHeader, topSx } from "../../components/LayoutHeader";

const Top = () => (
  <Stack sx={[topSx, { alignItems: "center", px: 2 }]}>
    <Typography variant="body1">Collections</Typography>
  </Stack>
);

const Bottom = ({
  folderControlGroupState,
  onDeleteButtonClick
}: {
  folderControlGroupState: number;
  onDeleteButtonClick: () => void;
}) => (
  <Stack sx={[bottomSx, { gap: "1px" }]}>
    <WButton
      onClick={onDeleteButtonClick}
      sx={{ backgroundColor: folderControlGroupState === 2 ? "primary.dark" : "primary.main" }}
      rightIcon={<CloseIcon sx={{ fontSize: 24 }} />}
    >
      Delete
    </WButton>
  </Stack>
);

export const LeftHeader = ({
  isLoading,
  folderControlGroupState,
  onDeleteButtonClick
}: {
  isLoading: boolean;
  numberOfFolders: number;
  serverHealth: boolean | undefined;
  folderControlGroupState: number;
  onDeleteButtonClick: () => void;
  onUploadButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => (
  <LayoutHeader
    top={<Top />}
    bottom={
      isLoading ? (
        <></>
      ) : (
        <Bottom folderControlGroupState={folderControlGroupState} onDeleteButtonClick={onDeleteButtonClick} />
      )
    }
  />
);
