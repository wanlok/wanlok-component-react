import { Dispatch, SetStateAction, useState } from "react";
import { Stack } from "@mui/material";
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
import { FolderCollectionHeader } from "./CollectionHeader";
import { CollectionChips } from "./CollectionChips";

export const CollectionPanel = ({
  isLoading,
  folders,
  selectedFolder,
  serverHealth,
  setPanelOpened,
  openFolder,
  deleteFolder,
  uploadFolders,
  downloadFolders,
  addFolder
}: {
  isLoading: boolean;
  folders: Folder[];
  selectedFolder: Folder | undefined;
  serverHealth: boolean | undefined;
  setPanelOpened: Dispatch<SetStateAction<boolean>>;
  openFolder: (folder: Folder) => void;
  deleteFolder: (folder: Folder) => Promise<void>;
  uploadFolders: () => Promise<void>;
  downloadFolders: () => Promise<void>;
  addFolder: (name: string) => Promise<void>;
}) => {
  const [folderControlGroupState, setFolderControlGroupState] = useState(0);

  return (
    <>
      <FolderCollectionHeader
        isLoading={isLoading}
        numberOfFolders={folders.length}
        serverHealth={serverHealth}
        folderControlGroupState={folderControlGroupState}
        onDeleteButtonClick={() => setFolderControlGroupState(folderControlGroupState === 1 ? 0 : 1)}
        onUploadButtonClick={uploadFolders}
        onDownloadButtonClick={downloadFolders}
      />
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
