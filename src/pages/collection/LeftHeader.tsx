import { Stack, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { iconButtonSx, WButton } from "../../components/WButton";
import { bottomSx, LayoutHeader, topSx } from "../../components/LayoutHeader";

const Top = () => (
  <Stack sx={[topSx, { px: 2, alignItems: "center" }]}>
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
    <WButton isActivated={folderControlGroupState === 1} sx={iconButtonSx} onClick={onDeleteButtonClick}>
      <CloseIcon sx={{ fontSize: 24 }} />
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
