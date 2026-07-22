import { useCollection } from "./useCollection";
import { useCollectionFilter } from "./useCollectionFilter";
import { useState } from "react";
import { LayoutPanel } from "../../components/LayoutPanel";
import { getDocumentId, useFolder } from "./useFolder";
import { EditAttributeModal } from "./EditAttributeModal";
import { AttributeModal } from "./AttributeModal";
import { ResetOrderConfirmationModal } from "./ResetOrderConfirmationModal";
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
  const [editAttributeModalOpen, setEditAttributeModalOpen] = useState(false);
  const [undoRearrangeModalOpen, setUndoRearrangeModalOpen] = useState(false);
  const [collectionTypeId, setCollectionTypeId] = useState<{ type: string; id: string } | undefined>(undefined);
  const {
    attributeKeys,
    attributeValues,
    selectedAttributeKey,
    selectedAttributeValue,
    onAttributeKeyChange,
    onAttributeValueChange,
    filteredFiles,
    filteredYouTubeRegularVideos,
    filteredYouTubeShortVideos
  } = useCollectionFilter(selectedFolder, files, youTubeRegularVideos, youTubeShortVideos);

  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      isLoading={!selectedFolder}
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
        attributeKeys={attributeKeys}
        attributeValues={attributeValues}
        selectedAttributeKey={selectedAttributeKey}
        selectedAttributeValue={selectedAttributeValue}
        onAttributeKeyChange={(value) => {
          onAttributeKeyChange(value);
          if (controlGroupState === 3) {
            setControlGroupState(0);
          }
        }}
        onAttributeValueChange={onAttributeValueChange}
        onAttributeButtonClick={() => setControlGroupState(controlGroupState === 1 ? 0 : 1)}
        onEditAttributeButtonClick={() => setEditAttributeModalOpen(true)}
        onDeleteButtonClick={() => setControlGroupState(controlGroupState === 2 ? 0 : 2)}
        onRearrangeButtonClick={() => setControlGroupState(controlGroupState === 3 ? 0 : 3)}
        onResetButtonClick={() => setUndoRearrangeModalOpen(true)}
        onDownloadButtonClick={() => {
          if (selectedFolder) {
            downloadFolder(selectedFolder);
          }
        }}
      />
      <RightContent
        isLoading={isCollectionLoading}
        charts={charts}
        files={filteredFiles}
        hyperlinks={hyperlinks}
        steam={steam}
        youTubeRegularVideos={filteredYouTubeRegularVideos}
        youTubeShortVideos={filteredYouTubeShortVideos}
        controlGroupState={controlGroupState}
        selectedFolder={selectedFolder}
        setCollectionTypeId={setCollectionTypeId}
        deleteCollectionItem={deleteCollectionItem}
        updateFolderCounts={updateFolderCounts}
        updateCollectionSequences={updateCollectionSequences}
        addCollectionItems={addCollectionItems}
        addCollectionFiles={addCollectionFiles}
      />
      <EditAttributeModal
        open={editAttributeModalOpen}
        onClose={() => setEditAttributeModalOpen(false)}
        selectedFolder={selectedFolder}
        updateFolderAttributes={updateFolderAttributes}
      />
      <AttributeModal
        charts={charts}
        files={files}
        hyperlinks={hyperlinks}
        steam={steam}
        youTubeRegularVideos={youTubeRegularVideos}
        youTubeShortVideos={youTubeShortVideos}
        collectionTypeId={collectionTypeId}
        setCollectionTypeId={setCollectionTypeId}
        selectedFolder={selectedFolder}
        updateCollectionAttributes={updateCollectionAttributes}
      />
      <ResetOrderConfirmationModal
        open={undoRearrangeModalOpen}
        onClose={() => setUndoRearrangeModalOpen(false)}
        onConfirm={resetFolderSequences}
      />
    </LayoutPanel>
  );
};
