import { useCollection } from "./useCollection";
import { WText } from "../../components/WText";
import { useState } from "react";
import { LayoutPanel } from "../../components/LayoutPanel";
import { getDocumentId, useFolder } from "./useFolder";
import { Direction } from "../../services/Types";
import { CollectionList } from "./CollectionList";
import { CollectionHeader } from "./CollectionHeader";
import { CollectionPanel } from "./CollectionPanel";
import { Dummy } from "./Dummy";
import { Dummy2 } from "./Dummy2";
import { PanelRow } from "../../components/PanelRow";
import { Folder as FolderIcon, Send as SendIcon, Upload as UploadIcon } from "@mui/icons-material";

export const CollectionPage = () => {
  const {
    serverHealth,
    isLoading,
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
  const [controlGroupState, setControlGroupState] = useState(0);
  const [open2, setOpen2] = useState(false);
  const [collectionTypeId, setCollectionTypeId] = useState<{ type: string; id: string } | undefined>(undefined);

  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <CollectionPanel
          isLoading={isLoading}
          folders={folders}
          selectedFolder={selectedFolder}
          serverHealth={serverHealth}
          setPanelOpened={setPanelOpened}
          openFolder={openFolder}
          deleteFolder={deleteFolder}
          uploadFolders={uploadFolders}
          downloadFolders={downloadFolders}
          addFolder={addFolder}
        />
      }
      topChildren={
        selectedFolder ? <PanelRow icon={<FolderIcon sx={{ fontSize: 24 }} />} title={selectedFolder.name} /> : <></>
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
        placeholder="Add Links or Upload Files"
        rightButtons={[
          {
            icon: <SendIcon sx={{ fontSize: 20 }} />,
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
            icon: <UploadIcon sx={{ fontSize: 24 }} />,
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
