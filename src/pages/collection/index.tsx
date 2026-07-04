import { Stack } from "@mui/material";
import { useCollection } from "./useCollection";
import { WText } from "../../components/WText";
import { WCardList } from "../../components/WCardList";
import { useState } from "react";
import { LayoutPanel } from "../../components/LayoutPanel";
import { getDocumentId, useFolder } from "./useFolder";
import { WIconButton } from "../../components/WButton";
import { Direction } from "../../services/Types";
import { CollectionList } from "./CollectionList";
import { CollectionHeader, FolderCollectionHeader } from "./CollectionHeader";
import { Dummy } from "./Dummy";
import { Dummy2 } from "./Dummy2";
import { CollectionPanelRow } from "./CollectionPanelRow";
import { Close as CloseIcon } from "@mui/icons-material";
import SendIcon from "../../assets/images/icons/send.png";
import UploadIcon from "../../assets/images/icons/upload.png";

export const CollectionPage = () => {
  const {
    serverHealth,
    folders,
    selectedFolder,
    addFolder,
    updateFolderAttributes,
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
    youTubeRegularVideos,
    youTubeShortVideos,
    addCollectionItems,
    addCollectionFiles,
    updateCollectionAttributes,
    updateCollectionSequences,
    deleteCollectionItem
  } = useCollection(getDocumentId(selectedFolder?.name), selectedFolder?.sequences, updateFolderSequences);
  const [panelOpened, setPanelOpened] = useState(false);
  const [folderControlGroupState, setFolderControlGroupState] = useState(0);
  const [controlGroupState, setControlGroupState] = useState(0);
  const [open2, setOpen2] = useState(false);
  const [collectionTypeId, setCollectionTypeId] = useState<{ type: string; id: string } | undefined>(undefined);

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
            renderContent={(folder) => <CollectionPanelRow folder={folder} selectedFolder={selectedFolder} showChips />}
            onContentClick={(folder) => {
              openFolder(folder);
              setPanelOpened(false);
            }}
            renderRightContent={(folder) => (
              <Stack sx={{}}>
                {folderControlGroupState === 1 && (
                  <WIconButton icon={<CloseIcon />} iconSize={16} onClick={() => deleteFolder(folder)} />
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
      topChildren={selectedFolder ? <CollectionPanelRow folder={selectedFolder} selectedFolder={selectedFolder} /> : <></>}
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
        youTubeRegularVideos={youTubeRegularVideos}
        youTubeShortVideos={youTubeShortVideos}
        controlGroupState={controlGroupState}
        onDetailsButtonClick={(type, id) => setCollectionTypeId({ type, id })}
        onDeleteButtonClick={async (type, id) => {
          const counts = await deleteCollectionItem(type, id);
          if (counts) {
            await updateFolderCounts(counts);
          }
        }}
        onLeftButtonClick={(type, id) => updateCollectionSequences(type, id, Direction.left)}
        onRightButtonClick={(type, id) => updateCollectionSequences(type, id, Direction.right)}
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
      <Dummy
        open={open2}
        setOpen={setOpen2}
        selectedFolder={selectedFolder}
        updateFolderAttributes={updateFolderAttributes}
      />
      <Dummy2
        files={files}
        collectionTypeId={collectionTypeId}
        setCollectionTypeId={setCollectionTypeId}
        selectedFolder={selectedFolder}
        updateCollectionAttributes={updateCollectionAttributes}
      />
    </LayoutPanel>
  );
};
