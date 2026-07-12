import { Dispatch, SetStateAction, useState } from "react";
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
import { TextInput } from "../../components/TextInput";
import { StyledContainer } from "../../components/StyledContainer";
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
  const [folderName, setFolderName] = useState("");

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
              <WButton onClick={() => deleteFolder(folder)} sx={{ ...iconButtonSx, backgroundColor: "transparent" }}>
                <CloseIcon sx={{ fontSize: 24 }} />
              </WButton>
            )}
          </Stack>
        )}
      />
      <Stack sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
        <StyledContainer sx={{ flex: 1, p: 1 }}>
          <TextInput placeholder="Add Folder" value={folderName} onChange={setFolderName} hideHelperText={true} />
        </StyledContainer>
        <WButton
          onClick={() => {
            if (folderName && folderName.trim().length > 0) {
              addFolder(folderName);
              setFolderName("");
            }
          }}
          sx={iconButtonSx}
        >
          <AddIcon sx={{ fontSize: 24 }} />
        </WButton>
      </Stack>
    </>
  );
};
