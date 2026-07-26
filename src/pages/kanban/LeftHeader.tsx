import { Stack, Typography } from "@mui/material";
import { bottomSx, LayoutHeader, topSx } from "../../components/LayoutHeader";
import { iconButtonSx, WButton } from "../../components/WButton";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";

const Top = () => (
  <Stack sx={[topSx, { alignItems: "center", px: 2 }]}>
    <Typography variant="body1">Kanban</Typography>
  </Stack>
);

const Bottom = ({
  controlGroupState,
  onAddButtonClick,
  onDeleteButtonClick
}: {
  controlGroupState: number;
  onAddButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => (
  <Stack sx={[bottomSx, { gap: "1px" }]}>
    <WButton onClick={onAddButtonClick} sx={iconButtonSx}>
      <AddIcon sx={{ fontSize: 24 }} />
    </WButton>
    <WButton isActivated={controlGroupState === 1} sx={iconButtonSx} onClick={onDeleteButtonClick}>
      <CloseIcon sx={{ fontSize: 24 }} />
    </WButton>
  </Stack>
);

export const LeftHeader = ({
  isLoading,
  controlGroupState,
  onAddButtonClick,
  onDeleteButtonClick
}: {
  isLoading: boolean;
  controlGroupState: number;
  onAddButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => (
  <LayoutHeader
    top={<Top />}
    bottom={
      isLoading ? (
        <></>
      ) : (
        <Bottom
          controlGroupState={controlGroupState}
          onAddButtonClick={onAddButtonClick}
          onDeleteButtonClick={onDeleteButtonClick}
        />
      )
    }
  />
);
