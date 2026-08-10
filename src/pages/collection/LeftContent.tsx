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
import { StyledContainer } from "../../components/StyledContainer";
import { TextInputWithButtons } from "../../components/TextInputWithButtons";
import { PanelRow } from "../../components/PanelRow";
import { CollectionChips } from "./CollectionChips";

export const LeftContent = ({
  isLoading,
  folders,
  selectedFolder,
  folderControlGroupState,
  setPanelOpened,
  openFolder,
  onDeleteFolderButtonClick,
  addFolder
}: {
  isLoading: boolean;
  folders: Folder[];
  selectedFolder: Folder | undefined;
  folderControlGroupState: number;
  setPanelOpened: Dispatch<SetStateAction<boolean>>;
  openFolder: (folder: Folder) => void;
  onDeleteFolderButtonClick: (folder: Folder) => void;
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
          if (folder) {
            openFolder(folder);
          }
          setPanelOpened(false);
        }}
        renderRightContent={(folder) => (
          <Stack>
            {folderControlGroupState === 1 && (
              <WButton
                onClick={() => onDeleteFolderButtonClick(folder)}
                sx={{ ...iconButtonSx, backgroundColor: "transparent", "&:hover": { backgroundColor: "action.hover" } }}
              >
                <CloseIcon sx={{ fontSize: 24 }} />
              </WButton>
            )}
          </Stack>
        )}
      />
      <StyledContainer>
        <TextInputWithButtons
          placeholder="Add Folder"
          rightButtons={[
            {
              icon: <AddIcon sx={{ fontSize: 26 }} />,
              onClickWithText: (text) => addFolder(text)
            }
          ]}
        />
      </StyledContainer>
    </>
  );
};
