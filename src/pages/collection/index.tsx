import { useCollection } from "./useCollection";
import { useState } from "react";
import { LayoutPanel } from "../../components/LayoutPanel";
import { getDocumentId, useFolder } from "./useFolder";
import { Dummy } from "./Dummy";
import { Dummy2 } from "./Dummy2";
import { LeftContent } from "./LeftContent";
import { LeftHeader } from "./LeftHeader";
import { PanelRow } from "../../components/PanelRow";
import { RightContent } from "./RightContent";
import { RightHeader } from "./RightHeader";
import { Folder as FolderIcon } from "@mui/icons-material";

export const CollectionPage = () => {
  const {
    serverHealth,
    isLoading: isFolderLoading,
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
    isLoading: isCollectionLoading,
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
          <LeftHeader
            isLoading={isFolderLoading}
            numberOfFolders={folders.length}
            serverHealth={serverHealth}
            folderControlGroupState={folderControlGroupState}
            onDeleteButtonClick={() => setFolderControlGroupState(folderControlGroupState === 1 ? 0 : 1)}
            onUploadButtonClick={uploadFolders}
            onDownloadButtonClick={downloadFolders}
          />
          <LeftContent
            isLoading={isFolderLoading}
            folders={folders}
            selectedFolder={selectedFolder}
            folderControlGroupState={folderControlGroupState}
            setPanelOpened={setPanelOpened}
            openFolder={openFolder}
            deleteFolder={deleteFolder}
            addFolder={addFolder}
          />
        </>
      }
      topChildren={
        selectedFolder ? <PanelRow icon={<FolderIcon sx={{ fontSize: 24 }} />} title={selectedFolder.name} /> : <></>
      }
    >
      <RightHeader
        isLoading={isCollectionLoading}
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
      <RightContent
        isLoading={isCollectionLoading}
        charts={charts}
        files={files}
        hyperlinks={hyperlinks}
        steam={steam}
        youTubeRegularVideos={youTubeRegularVideos}
        youTubeShortVideos={youTubeShortVideos}
        controlGroupState={controlGroupState}
        selectedFolder={selectedFolder}
        setCollectionTypeId={setCollectionTypeId}
        deleteCollectionItem={deleteCollectionItem}
        updateFolderCounts={updateFolderCounts}
        updateCollectionSequences={updateCollectionSequences}
        addCollectionItems={addCollectionItems}
        addCollectionFiles={addCollectionFiles}
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
