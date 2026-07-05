import { Stack, Typography } from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  LowPriority as LowPriorityIcon,
  SwapHoriz as SwapHorizIcon
} from "@mui/icons-material";
import { WButton } from "../../components/WButton";
import { Folder } from "../../services/Types";
import { SelectInput } from "../../components/SelectInput";
import { bottomSx, LayoutHeader, topSx } from "../../components/LayoutHeader";

const Top = ({ folder }: { folder: Folder | undefined }) => (
  <Stack sx={[topSx, { alignItems: "center", px: 2 }]}>
    <Typography variant="body1" sx={{ flex: 1 }}>
      {folder ? folder.name : ""}
    </Typography>
  </Stack>
);

const Bottom = ({
  resetButtonHidden,
  controlGroupState,
  onInfoButtonClick,
  onDeleteButtonClick,
  onLeftRightButtonClick,
  onResetButtonClick,
  onDownloadButtonClick
}: {
  resetButtonHidden: boolean;
  controlGroupState: number;
  onInfoButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onLeftRightButtonClick: () => void;
  onResetButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => (
  <Stack sx={[bottomSx]}>
    <Stack sx={{ flex: 1, justifyContent: "center", p: 1 }}>
      <SelectInput items={[{ label: "Test", value: "test" }]} value={"test"} onChange={() => {}} />
    </Stack>
    <Stack sx={{ flexDirection: "row", gap: 1 }}>
      <Stack sx={{ flexDirection: "row", gap: "1px" }}>
        <WButton
          onClick={onInfoButtonClick}
          sx={{ backgroundColor: controlGroupState === 1 ? "primary.dark" : "primary.main" }}
          rightIcon={<EditIcon sx={{ fontSize: 18 }} />}
        >
          Attributes
        </WButton>
        <WButton
          onClick={onDeleteButtonClick}
          sx={{ backgroundColor: controlGroupState === 2 ? "primary.dark" : "primary.main" }}
          rightIcon={<CloseIcon sx={{ fontSize: 24 }} />}
        >
          Delete
        </WButton>
        <WButton
          onClick={onLeftRightButtonClick}
          sx={{ backgroundColor: controlGroupState === 3 ? "primary.dark" : "primary.main" }}
          rightIcon={<SwapHorizIcon sx={{ fontSize: 26 }} />}
        >
          Rearrange
        </WButton>
        {!resetButtonHidden && (
          <WButton
            onClick={onResetButtonClick}
            sx={{ backgroundColor: "primary.main" }}
            rightIcon={<LowPriorityIcon sx={{ fontSize: 24 }} />}
          >
            Reset
          </WButton>
        )}
        <WButton
          onClick={onDownloadButtonClick}
          sx={{ backgroundColor: "primary.main" }}
          rightIcon={<DownloadIcon sx={{ fontSize: 24 }} />}
        >
          Download
        </WButton>
      </Stack>
    </Stack>
  </Stack>
);

export const RightHeader = ({
  isLoading,
  folder,
  resetButtonHidden,
  controlGroupState,
  onInfoButtonClick,
  onDeleteButtonClick,
  onLeftRightButtonClick,
  onResetButtonClick,
  onDownloadButtonClick
}: {
  isLoading: boolean;
  folder: Folder | undefined;
  resetButtonHidden: boolean;
  controlGroupState: number;
  onInfoButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onLeftRightButtonClick: () => void;
  onResetButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => (
  <LayoutHeader
    top={<Top folder={folder} />}
    bottom={
      isLoading ? (
        <></>
      ) : (
        <Bottom
          resetButtonHidden={resetButtonHidden}
          controlGroupState={controlGroupState}
          onInfoButtonClick={onInfoButtonClick}
          onDeleteButtonClick={onDeleteButtonClick}
          onLeftRightButtonClick={onLeftRightButtonClick}
          onResetButtonClick={onResetButtonClick}
          onDownloadButtonClick={onDownloadButtonClick}
        />
      )
    }
  />
);
