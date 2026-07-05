import { Dispatch, SetStateAction } from "react";
import { Stack } from "@mui/material";
import { LayoutLoading } from "../../components/LayoutLoading";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Folder as FolderIcon,
  FolderOutlined as FolderOutlinedIcon
} from "@mui/icons-material";
import { Folder } from "../../services/Types";
import { WCardList } from "../../components/WCardList";
import { iconButtonSx, WButton } from "../../components/WButton";
import { WText } from "../../components/WText";
import { PanelRow } from "../../components/PanelRow";
import { CollectionChips } from "./CollectionChips";

export const LeftContent = ({
  isLoading,
  folders,
  selectedFolder,
  folderControlGroupState,
  setPanelOpened,
  openFolder,
  deleteFolder,
  addFolder
}: {
  isLoading: boolean;
  folders: Folder[];
  selectedFolder: Folder | undefined;
  folderControlGroupState: number;
  setPanelOpened: Dispatch<SetStateAction<boolean>>;
  openFolder: (folder: Folder) => void;
  deleteFolder: (folder: Folder) => Promise<void>;
  addFolder: (name: string) => Promise<void>;
}) => {
  if (isLoading) {
    return <LayoutLoading />;
  }
  return (
    <>
      <WCardList
        items={folders}
        renderContent={(folder) => {
          const Icon = folder === selectedFolder ? FolderIcon : FolderOutlinedIcon;
          return (
            <PanelRow icon={<Icon sx={{ fontSize: 24 }} />} title={folder.name}>
              <CollectionChips folder={folder} />
            </PanelRow>
          );
        }}
        onContentClick={(folder) => {
          openFolder(folder);
          setPanelOpened(false);
        }}
        renderRightContent={(folder) => (
          <Stack>
            {folderControlGroupState === 1 && (
              <WButton onClick={() => deleteFolder(folder)} sx={iconButtonSx}>
                <CloseIcon sx={{ fontSize: 24 }} />
              </WButton>
            )}
          </Stack>
        )}
      />
      <WText
        placeholder="Add Folder"
        rightButtons={[{ icon: <AddIcon sx={{ fontSize: 24 }} />, onClickWithText: addFolder }]}
      />
    </>
  );
};
