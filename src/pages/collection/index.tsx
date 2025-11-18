import { Box, Stack, Typography } from "@mui/material";
import { useCollection } from "./useCollection";
import { WText } from "../../components/WText";
import { WCardList } from "../../components/WCardList";
import { useState } from "react";
import { LayoutPanel } from "../../components/LayoutPanel";
import { getDocumentId, useFolder } from "./useFolder";
import { WIconButton } from "../../components/WButton";
import { WChip } from "../../components/WChip";
import { Direction, Folder } from "../../services/Types";
import { CollectionList } from "./CollectionList";
import { CollectionHeader, FolderCollectionHeader } from "./CollectionHeader";
import { WModal } from "../../components/WModal";

import FolderIcon from "../../assets/images/icons/folder.png";
import FolderSelectedIcon from "../../assets/images/icons/folder_selected.png";
import DocumentSelectedIcon from "../../assets/images/icons/document_selected.png";
import UpIcon from "../../assets/images/icons/up.png";
import DownIcon from "../../assets/images/icons/down.png";
import CrossIcon from "../../assets/images/icons/cross.png";
import HyperlinkIcon from "../../assets/images/icons/hyperlink.png";
import SteamIcon from "../../assets/images/icons/steam.png";
import YouTubeIcon from "../../assets/images/icons/youtube.png";
import SendIcon from "../../assets/images/icons/send.png";
import UploadIcon from "../../assets/images/icons/upload.png";
import { Aaa, Dummy } from "./Dummy";

const FolderRow = ({
  folder,
  selectedFolder,
  panelOpened
}: {
  folder: Folder;
  selectedFolder?: Folder;
  panelOpened?: boolean;
}) => {
  const { files, hyperlinks, steam, youtube_regular, youtube_shorts } = folder.counts;
  const mobileRow = panelOpened === true || panelOpened === false;
  return (
    <Stack
      sx={{
        flexDirection: "row",
        minHeight: (mobileRow ? 48 : 48 + 48 + 1) + "px",
        py: 2,
        pl: 2,
        pr: mobileRow ? 2 : 0,
        gap: 2,
        boxSizing: "border-box",
        backgroundColor: mobileRow ? "background.default" : "transparent"
      }}
    >
      <Box
        component="img"
        src={folder === selectedFolder ? FolderSelectedIcon : FolderIcon}
        alt=""
        sx={{ width: "24px", height: "24px" }}
      />
      <Stack sx={{ flex: 1, gap: 1, pr: 2 }}>
        <Typography variant="body1">{folder.name}</Typography>
        {panelOpened === undefined && Object.values(folder.counts).some((count) => count > 0) && (
          <Stack sx={{ flexDirection: "row", gap: 1 }}>
            {files > 0 && <WChip icon={DocumentSelectedIcon} label={`${files}`} />}
            {hyperlinks > 0 && <WChip icon={HyperlinkIcon} label={`${hyperlinks}`} />}
            {steam > 0 && <WChip icon={SteamIcon} label={`${steam}`} />}
            {youtube_regular > 0 && youtube_shorts > 0 && (
              <WChip icon={YouTubeIcon} label={`${youtube_shorts} + ${youtube_regular}`} />
            )}
            {youtube_regular === 0 && youtube_shorts > 0 && <WChip icon={YouTubeIcon} label={`${youtube_shorts}`} />}
            {youtube_regular > 0 && youtube_shorts === 0 && <WChip icon={YouTubeIcon} label={`${youtube_regular}`} />}
          </Stack>
        )}
      </Stack>
      {mobileRow && (
        <Box
          component="img"
          src={panelOpened ? UpIcon : DownIcon}
          alt=""
          sx={{ width: "16px", height: "16px", mt: "4px" }}
        />
      )}
    </Stack>
  );
};

export const CollectionPage = () => {
  const {
    serverHealth,
    folders,
    selectedFolder,
    addFolder,
    updateFolderCounts,
    updateFolderSequences,
    isFolderSorted,
    resetFolderSequences,
    deleteFolder,
    openFolder,
    uploadFolders,
    downloadFolder,
    downloadFolders
  } = useFolder();
  const {
    charts,
    files,
    hyperlinks,
    steam,
    texts,
    youTubeRegularVideos,
    youTubeShortVideos,
    addCollectionItems,
    addCollectionFiles,
    updateCollection,
    deleteCollectionItem
  } = useCollection(getDocumentId(selectedFolder?.name), selectedFolder?.sequences, updateFolderSequences);
  const [panelOpened, setPanelOpened] = useState(false);
  const [folderControlGroupState, setFolderControlGroupState] = useState(0);
  const [controlGroupState, setControlGroupState] = useState(0);
  const [open2, setOpen2] = useState(false);
  const [open, setOpen] = useState(false);
  const [attributes, setAttributes] = useState<Aaa[]>([]);
  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <FolderCollectionHeader
            numberOfFolders={folders.length}
            serverHealth={serverHealth}
            folderControlGroupState={folderControlGroupState}
            onDeleteButtonClick={() => setFolderControlGroupState(folderControlGroupState === 1 ? 0 : 1)}
            onUploadButtonClick={uploadFolders}
            onDownloadButtonClick={downloadFolders}
          />
          <WCardList
            items={folders}
            renderContent={(folder) => <FolderRow folder={folder} selectedFolder={selectedFolder} />}
            onContentClick={(folder) => {
              openFolder(folder);
              setPanelOpened(false);
            }}
            renderRightContent={(folder) => (
              <Stack sx={{}}>
                {folderControlGroupState === 1 && (
                  <WIconButton icon={CrossIcon} iconSize={16} onClick={() => deleteFolder(folder)} />
                )}
              </Stack>
            )}
          />
          <WText
            placeholder="New Folder"
            rightButtons={[{ label: "Add", onClickWithText: (text) => addFolder(text) }]}
          />
        </>
      }
      topChildren={
        selectedFolder ? (
          <FolderRow folder={selectedFolder} selectedFolder={selectedFolder} panelOpened={panelOpened} />
        ) : (
          <></>
        )
      }
    >
      <CollectionHeader
        folder={selectedFolder}
        resetButtonHidden={!isFolderSorted()}
        controlGroupState={controlGroupState}
        onInfoButtonClick={() => setOpen2(true)}
        onDeleteButtonClick={() => setControlGroupState(controlGroupState === 2 ? 0 : 2)}
        onLeftRightButtonClick={() => setControlGroupState(controlGroupState === 3 ? 0 : 3)}
        onResetButtonClick={resetFolderSequences}
        onDownloadButtonClick={() => {
          if (selectedFolder) {
            downloadFolder(selectedFolder);
          }
        }}
      />
      <CollectionList
        charts={charts}
        files={files}
        hyperlinks={hyperlinks}
        steam={steam}
        texts={texts}
        youTubeRegularVideos={youTubeRegularVideos}
        youTubeShortVideos={youTubeShortVideos}
        controlGroupState={controlGroupState}
        onDetailsButtonClick={() => setOpen(true)}
        onDeleteButtonClick={async (type, id) => {
          const counts = await deleteCollectionItem(type, id);
          if (counts) {
            await updateFolderCounts(counts);
          }
        }}
        onLeftButtonClick={(type, id) => updateCollection(type, id, Direction.left)}
        onRightButtonClick={(type, id) => updateCollection(type, id, Direction.right)}
      />
      <WText
        placeholder="Links"
        rightButtons={[
          {
            icon: SendIcon,
            size: 18,
            onClickWithText: async (text) => {
              const collectionId = getDocumentId(selectedFolder?.name);
              if (collectionId) {
                const counts = await addCollectionItems(collectionId, text);
                if (counts) {
                  await updateFolderCounts(counts);
                }
              }
            }
          },
          {
            icon: UploadIcon,
            size: 18,
            onClick: async () => {
              const collectionId = getDocumentId(selectedFolder?.name);
              if (collectionId) {
                const counts = await addCollectionFiles(collectionId);
                if (counts) {
                  await updateFolderCounts(counts);
                }
              }
            }
          }
        ]}
      />
      <WModal open={open2} onClose={() => setOpen2(false)}>
        <Dummy attributes={attributes} setAttributes={setAttributes} />
      </WModal>
      <WModal open={open} onClose={() => setOpen(false)}>
        <Typography>Hello World</Typography>
      </WModal>
    </LayoutPanel>
  );
};
