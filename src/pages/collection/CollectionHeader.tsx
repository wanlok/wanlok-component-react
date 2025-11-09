import { Stack, Typography } from "@mui/material";
import { WChip } from "../../components/WChip";

import FolderSelectedIcon from "../../assets/images/icons/folder_selected.png";
import ResetIcon from "../../assets/images/icons/reset.png";
import UploadIcon from "../../assets/images/icons/upload.png";
import DownloadIcon from "../../assets/images/icons/download.png";
import GreenCircleIcon from "../../assets/images/icons/green_circle.png";
import RedCircleIcon from "../../assets/images/icons/red_circle.png";
import CrossIcon from "../../assets/images/icons/cross.png";
import LeftRightIcon from "../../assets/images/icons/left_right.png";
import { WIconButton } from "../../components/WButton";
import { Folder } from "../../services/Types";
import { SelectInput } from "../../components/SelectInput";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";

export const FolderCollectionHeader = ({
  numberOfFolders,
  serverHealth,
  folderControlGroupState,
  onDeleteButtonClick,
  onUploadButtonClick,
  onDownloadButtonClick
}: {
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
        <Stack sx={[topSx, { px: 1 }]}>
          <Typography variant="body1" sx={{ flex: 1 }}>
            Collections
          </Typography>
          <WChip icon={FolderSelectedIcon} label={`${numberOfFolders}`} />
          <WChip icon={serverHealth ? GreenCircleIcon : RedCircleIcon} label={"Server"} />
        </Stack>
      }
      bottom={
        <Stack sx={{ flexDirection: "row", gap: 1 }}>
          <Stack sx={{ flexDirection: "row", gap: "1px" }}>
            <WIconButton
              icon={CrossIcon}
              iconSize={16}
              onClick={onDeleteButtonClick}
              sx={{ backgroundColor: folderControlGroupState === 1 ? "primary.dark" : "primary.main" }}
            />
          </Stack>
          <Stack sx={{ flexDirection: "row", gap: "1px" }}>
            <WIconButton
              icon={UploadIcon}
              iconSize={18}
              onClick={onUploadButtonClick}
              sx={{ backgroundColor: "primary.main" }}
            />
            <WIconButton
              icon={DownloadIcon}
              iconSize={18}
              onClick={onDownloadButtonClick}
              sx={{ backgroundColor: "primary.main" }}
            />
          </Stack>
        </Stack>
      }
    />
  );
};

export const CollectionHeader = ({
  folder,
  resetButtonHidden,
  controlGroupState,
  onDeleteButtonClick,
  onLeftRightButtonClick,
  onResetButtonClick,
  onDownloadButtonClick
}: {
  folder: Folder | undefined;
  resetButtonHidden: boolean;
  controlGroupState: number;
  onDeleteButtonClick: () => void;
  onLeftRightButtonClick: () => void;
  onResetButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => {
  return (
    <LayoutHeader
      top={
        <Stack sx={[topSx, { px: 1 }]}>
          <Typography variant="body1" sx={{ flex: 1 }}>
            {folder ? folder.name : ""}
          </Typography>
          <SelectInput items={[{ label: "Test", value: "test" }]} value={"test"} onChange={(value: string) => {}} />
        </Stack>
      }
      bottom={
        <Stack sx={{ flexDirection: "row", gap: 1 }}>
          <Stack sx={{ flexDirection: "row", gap: "1px" }}>
            <WIconButton
              icon={CrossIcon}
              iconSize={16}
              onClick={onDeleteButtonClick}
              sx={{ backgroundColor: controlGroupState === 1 ? "primary.dark" : "primary.main" }}
            />
            <WIconButton
              icon={LeftRightIcon}
              iconSize={24}
              onClick={onLeftRightButtonClick}
              sx={{ backgroundColor: controlGroupState === 2 ? "primary.dark" : "primary.main" }}
            />
          </Stack>
          <Stack sx={{ flexDirection: "row", gap: "1px" }}>
            {!resetButtonHidden && (
              <WIconButton
                icon={ResetIcon}
                iconSize={20}
                onClick={onResetButtonClick}
                sx={{ backgroundColor: "primary.main" }}
              />
            )}
            <WIconButton
              icon={DownloadIcon}
              iconSize={18}
              onClick={onDownloadButtonClick}
              sx={{ backgroundColor: "primary.main" }}
            />
          </Stack>
        </Stack>
      }
    />
  );
};
