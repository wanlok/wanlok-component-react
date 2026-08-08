import { useCollection } from "./useCollection";
import { useCollectionFilter } from "./useCollectionFilter";
import { toSlug } from "../../common/StringUtils";
import { useState } from "react";
import { LayoutPanel } from "../../components/LayoutPanel";
import { getDocumentId, useFolder } from "./useFolder";
import { FolderModal } from "./FolderModal";
import { DeleteConfirmationModal } from "../../components/DeleteConfirmationModal";
import { ResetOrderConfirmationModal } from "./ResetOrderConfirmationModal";
import { UploadImageModal } from "./UploadImageModal";
import { useUploadImage } from "./useUploadImage";
import { LeftContent } from "./LeftContent";
import { LeftHeader } from "./LeftHeader";
import { PanelRow } from "../../components/PanelRow";
import { RightContent } from "./RightContent";
import { RightHeader } from "./RightHeader";
import { Folder as FolderIcon } from "@mui/icons-material";
import { Folder } from "../../services/Types";

export const CollectionPage = () => {
  const {
    isLoading: isFolderLoading,
    folders,
    selectedFolder,
    addFolder,
    updateFolder,
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
    loadingCount,
    addCollectionItems,
    addCollectionFiles,
    addCollectionBlob,
    updateCollectionFile,
    updateCollectionVideo,
    renameCollectionAttributeKey,
    renameCollection,
    updateCollectionSequences,
    deleteCollectionItem
  } = useCollection(getDocumentId(selectedFolder?.name), selectedFolder?.sequences, updateFolder);
  const uploadImageAttributes = useUploadImage({
    selectedFolder,
    onUpload: async (blob, name) => {
      const collectionId = getDocumentId(selectedFolder?.name);
      if (collectionId) {
        const counts = await addCollectionBlob(collectionId, blob, name);
        await updateFolder({ counts });
      }
    }
  });
  const [panelOpened, setPanelOpened] = useState(false);
  const [folderControlGroupState, setFolderControlGroupState] = useState(0);
  const [controlGroupState, setControlGroupState] = useState(0);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [resetOrderModalOpen, setResetOrderModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | undefined>(undefined);
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

  const effectiveFolderControlGroupState = folders.length === 0 ? 0 : folderControlGroupState;

  const count =
    charts.length +
    files.length +
    hyperlinks.length +
    steam.length +
    youTubeRegularVideos.length +
    youTubeShortVideos.length;
  const effectiveControlGroupState = count === 0 ? 0 : controlGroupState;

  const onDeleteFolderButtonClick = (folder: Folder) => {
    setFolderToDelete(folder);
  };

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
            folderControlGroupState={effectiveFolderControlGroupState}
            onDeleteButtonClick={() => setFolderControlGroupState(effectiveFolderControlGroupState === 1 ? 0 : 1)}
            onUploadButtonClick={uploadFolders}
            onDownloadButtonClick={downloadFolders}
          />
          <LeftContent
            isLoading={isFolderLoading}
            folders={folders}
            selectedFolder={selectedFolder}
            folderControlGroupState={effectiveFolderControlGroupState}
            setPanelOpened={setPanelOpened}
            openFolder={(folder) => {
              openFolder(folder);
              setControlGroupState(0);
            }}
            onDeleteFolderButtonClick={onDeleteFolderButtonClick}
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
        controlGroupState={effectiveControlGroupState}
        attributeKeys={attributeKeys}
        attributeValues={attributeValues}
        selectedAttributeKey={selectedAttributeKey}
        selectedAttributeValue={selectedAttributeValue}
        onAttributeKeyChange={(value) => {
          onAttributeKeyChange(value);
          if (effectiveControlGroupState === 2) {
            setControlGroupState(0);
          }
        }}
        onAttributeValueChange={onAttributeValueChange}
        onEditFolderButtonClick={() => setFolderModalOpen(true)}
        onDeleteButtonClick={() => setControlGroupState(effectiveControlGroupState === 3 ? 0 : 3)}
        onRearrangeButtonClick={() => setControlGroupState(effectiveControlGroupState === 2 ? 0 : 2)}
        onResetButtonClick={() => setResetOrderModalOpen(true)}
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
        controlGroupState={effectiveControlGroupState}
        selectedFolder={selectedFolder}
        deleteCollectionItem={deleteCollectionItem}
        updateFolder={updateFolder}
        updateCollectionSequences={updateCollectionSequences}
        loadingCount={loadingCount}
        addCollectionItems={addCollectionItems}
        addCollectionFiles={addCollectionFiles}
        updateCollectionFile={updateCollectionFile}
        updateCollectionVideo={updateCollectionVideo}
      />
      <FolderModal
        key={`folder-modal-${folderModalOpen ? (selectedFolder?.name ?? "new") : "closed"}`}
        open={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        selectedFolder={selectedFolder}
        updateFolderAttributes={async (newFolderName, newAttributes) => {
          const oldAttributes = selectedFolder?.attributes ?? [];
          const oldNames = new Set(oldAttributes.map((attribute) => attribute.name));
          const newNames = new Set(newAttributes.map((attribute) => attribute.name));
          for (let i = 0; i < Math.min(oldAttributes.length, newAttributes.length); i++) {
            const oldName = oldAttributes[i].name;
            const newName = newAttributes[i].name;
            if (oldName && newName && oldName !== newName && !newNames.has(oldName) && !oldNames.has(newName)) {
              await renameCollectionAttributeKey(oldName, newName);
              if (selectedAttributeKey === toSlug(oldName)) {
                onAttributeKeyChange(toSlug(newName));
              }
            }
          }
          if (newFolderName !== selectedFolder?.name) {
            const newId = getDocumentId(newFolderName);
            if (newId) {
              await renameCollection(newId);
            }
          }
          await updateFolder({ name: newFolderName, attributes: newAttributes });
        }}
      />
      <ResetOrderConfirmationModal
        open={resetOrderModalOpen}
        onClose={() => setResetOrderModalOpen(false)}
        onConfirm={resetFolderSequences}
      />
      <DeleteConfirmationModal
        open={Boolean(folderToDelete)}
        title="Delete Folder"
        name={folderToDelete?.name}
        onClose={() => setFolderToDelete(undefined)}
        onConfirm={() => {
          if (folderToDelete) {
            deleteFolder(folderToDelete);
            setFolderControlGroupState(0);
          }
        }}
      />
      <UploadImageModal {...uploadImageAttributes} />
    </LayoutPanel>
  );
};
