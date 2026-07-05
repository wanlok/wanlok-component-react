import { Stack, Typography } from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  LowPriority as LowPriorityIcon,
  SwapHoriz as SwapHorizIcon,
  ViewList as ViewListIcon
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
  onAttributeButtonClick,
  onEditAttributesButtonClick,
  onDeleteButtonClick,
  onRearrangeButtonClick,
  onResetButtonClick,
  onDownloadButtonClick
}: {
  resetButtonHidden: boolean;
  controlGroupState: number;
  onAttributeButtonClick: () => void;
  onEditAttributesButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onRearrangeButtonClick: () => void;
  onResetButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => (
  <Stack sx={[bottomSx]}>
    <Stack sx={{ flex: 1, justifyContent: "center", p: 1 }}>
      <SelectInput items={[{ label: "Test", value: "test" }]} value={"test"} onChange={() => {}} />
    </Stack>
    <Stack sx={{ flexDirection: "row", gap: 1 }}>
      <Stack sx={{ flexDirection: "row", gap: "1px" }}>
        <WButton onClick={onAttributeButtonClick} rightIcon={<ViewListIcon sx={{ fontSize: 24 }} />}>
          Attributes
        </WButton>
        <WButton onClick={onEditAttributesButtonClick} rightIcon={<EditIcon sx={{ fontSize: 18 }} />}>
          Edit Attributes
        </WButton>
        <WButton onClick={onDeleteButtonClick} rightIcon={<CloseIcon sx={{ fontSize: 24 }} />}>
          Delete
        </WButton>
        <WButton onClick={onRearrangeButtonClick} rightIcon={<SwapHorizIcon sx={{ fontSize: 26 }} />}>
          Rearrange
        </WButton>
        {!resetButtonHidden && (
          <WButton onClick={onResetButtonClick} rightIcon={<LowPriorityIcon sx={{ fontSize: 24 }} />}>
            Reset
          </WButton>
        )}
        <WButton onClick={onDownloadButtonClick} rightIcon={<DownloadIcon sx={{ fontSize: 24 }} />}>
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
  onAttributeButtonClick,
  onEditAttributesButtonClick,
  onDeleteButtonClick,
  onRearrangeButtonClick,
  onResetButtonClick,
  onDownloadButtonClick
}: {
  isLoading: boolean;
  folder: Folder | undefined;
  resetButtonHidden: boolean;
  controlGroupState: number;
  onAttributeButtonClick: () => void;
  onEditAttributesButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onRearrangeButtonClick: () => void;
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
          onAttributeButtonClick={onAttributeButtonClick}
          onEditAttributesButtonClick={onEditAttributesButtonClick}
          onDeleteButtonClick={onDeleteButtonClick}
          onRearrangeButtonClick={onRearrangeButtonClick}
          onResetButtonClick={onResetButtonClick}
          onDownloadButtonClick={onDownloadButtonClick}
        />
      )
    }
  />
);
