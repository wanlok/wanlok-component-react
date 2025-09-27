import { Stack, Typography } from "@mui/material";
import { WChip } from "../../components/WChip";

import FolderSelectedIcon from "../../assets/images/icons/folder_selected.png";
import ResetIcon from "../../assets/images/icons/reset.png";
import UploadIcon from "../../assets/images/icons/upload.png";
import DownloadIcon from "../../assets/images/icons/download.png";
import GreenCircleIcon from "../../assets/images/icons/green_circle.png";
import RedCircleIcon from "../../assets/images/icons/red_circle.png";
import HiddenIcon from "../../assets/images/icons/hidden.png";
import DeleteIcon from "../../assets/images/icons/delete.png";
import LeftRightIcon from "../../assets/images/icons/left_right.png";
import { WIconButton } from "../../components/WButton";
import { Folder } from "../../services/Types";
import { SelectInput } from "../../components/SelectInput";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";

export const FolderCollectionHeader = ({
  numberOfFolders,
  serverHealth,
  onHiddenButtonClick,
  onDeleteButtonClick,
  onUploadButtonClick,
  onDownloadButtonClick
}: {
  numberOfFolders: number;
  serverHealth: boolean | undefined;
  onHiddenButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onUploadButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => {
  return (
    <LayoutHeader
      top={
        <Stack sx={topSx}>
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
              icon={HiddenIcon}
              iconSize={24}
              onClick={onHiddenButtonClick}
              sx={{ backgroundColor: "primary.main" }}
            />
            <WIconButton
              icon={DeleteIcon}
              iconSize={20}
              onClick={onDeleteButtonClick}
              sx={{ backgroundColor: "primary.main" }}
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
  onHiddenButtonClick,
  onDeleteButtonClick,
  onLeftRightButtonClick,
  onResetButtonClick,
  onDownloadButtonClick
}: {
  folder: Folder | undefined;
  resetButtonHidden: boolean;
  onHiddenButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onLeftRightButtonClick: () => void;
  onResetButtonClick: () => void;
  onDownloadButtonClick: () => void;
}) => {
  return (
    <LayoutHeader
      top={
        <Stack sx={topSx}>
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
              icon={HiddenIcon}
              iconSize={24}
              onClick={onHiddenButtonClick}
              sx={{ backgroundColor: "primary.main" }}
            />
            <WIconButton
              icon={DeleteIcon}
              iconSize={20}
              onClick={onDeleteButtonClick}
              sx={{ backgroundColor: "primary.main" }}
            />
            <WIconButton
              icon={LeftRightIcon}
              iconSize={24}
              onClick={onLeftRightButtonClick}
              sx={{ backgroundColor: "primary.main" }}
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
