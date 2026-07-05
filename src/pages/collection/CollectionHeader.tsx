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

export const FolderCollectionHeader = ({
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
}) => {
  return (
    <LayoutHeader
      top={
        <Stack sx={[topSx, { alignItems: "center", px: 2 }]}>
          <Typography variant="body1">Collections</Typography>
        </Stack>
      }
      bottom={
        isLoading ? (
          <></>
        ) : (
          <Stack sx={[bottomSx, { gap: "1px" }]}>
            <WButton
              onClick={onDeleteButtonClick}
              sx={{ backgroundColor: folderControlGroupState === 2 ? "primary.dark" : "primary.main" }}
              leftIcon={<CloseIcon sx={{ fontSize: 24 }} />}
            >
              Delete
            </WButton>
          </Stack>
        )
      }
    />
  );
};

export const CollectionHeader = ({
  folder,
  resetButtonHidden,
  controlGroupState,
  onInfoButtonClick,
  onDeleteButtonClick,
  onLeftRightButtonClick,
  onResetButtonClick,
  onDownloadButtonClick
}: {
  folder: Folder | undefined;
  resetButtonHidden: boolean;
  controlGroupState: number;
  onInfoButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onLeftRightButtonClick: () => void;
  onResetButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => {
  return (
    <LayoutHeader
      top={
        <Stack sx={[topSx, { alignItems: "center", px: 2 }]}>
          <Typography variant="body1" sx={{ flex: 1 }}>
            {folder ? folder.name : ""}
          </Typography>
        </Stack>
      }
      bottom={
        <Stack sx={[bottomSx]}>
          <Stack sx={{ flex: 1, justifyContent: "center", p: 1 }}>
            <SelectInput items={[{ label: "Test", value: "test" }]} value={"test"} onChange={() => {}} />
          </Stack>
          <Stack sx={{ flexDirection: "row", gap: 1 }}>
            <Stack sx={{ flexDirection: "row", gap: "1px" }}>
              <WButton
                onClick={onInfoButtonClick}
                sx={{ backgroundColor: controlGroupState === 1 ? "primary.dark" : "primary.main" }}
                leftIcon={<EditIcon sx={{ fontSize: 18 }} />}
              >
                Edit Attributes
              </WButton>
              <WButton
                onClick={onDeleteButtonClick}
                sx={{ backgroundColor: controlGroupState === 2 ? "primary.dark" : "primary.main" }}
                leftIcon={<CloseIcon sx={{ fontSize: 24 }} />}
              >
                Delete
              </WButton>
              <WButton
                onClick={onLeftRightButtonClick}
                sx={{ backgroundColor: controlGroupState === 3 ? "primary.dark" : "primary.main" }}
                leftIcon={<SwapHorizIcon sx={{ fontSize: 26 }} />}
              >
                Rearrange
              </WButton>
              {!resetButtonHidden && (
                <WButton
                  onClick={onResetButtonClick}
                  sx={{ backgroundColor: "primary.main" }}
                  leftIcon={<LowPriorityIcon sx={{ fontSize: 24 }} />}
                >
                  Reset
                </WButton>
              )}
              <WButton
                onClick={onDownloadButtonClick}
                sx={{ backgroundColor: "primary.main" }}
                leftIcon={<DownloadIcon sx={{ fontSize: 24 }} />}
              >
                Download
              </WButton>
            </Stack>
          </Stack>
        </Stack>
      }
    />
  );
};
