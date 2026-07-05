import { useCollection } from "./useCollection";
import { useEffect, useState } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    setSelectedCategory("");
  }, [selectedFolder?.name]);

  const uncategorisedValue = "__uncategorised__";

  const hasUncategorised = [...files, ...youTubeRegularVideos, ...youTubeShortVideos].some(
    ([, item]) => !item.attributes?.["category"]
  );

  useEffect(() => {
    if (!hasUncategorised && selectedCategory === uncategorisedValue) {
      setSelectedCategory("");
    }
  }, [hasUncategorised, selectedCategory]);

  const categoryItems = [
    { label: "All", value: "" },
    ...(hasUncategorised ? [{ label: "All (Uncategorised)", value: uncategorisedValue }] : []),
    ...[
      ...new Set(
        [
          ...files.map(([, item]) => item.attributes?.["category"]),
          ...youTubeRegularVideos.map(([, item]) => item.attributes?.["category"]),
          ...youTubeShortVideos.map(([, item]) => item.attributes?.["category"])
        ].filter((v): v is string => Boolean(v))
      )
    ].sort().map((category) => ({ label: category, value: category }))
  ];

  const matchesCategory = (category: string | undefined) =>
    selectedCategory === uncategorisedValue ? !category : category === selectedCategory;

  const filteredFiles = selectedCategory ? files.filter(([, item]) => matchesCategory(item.attributes?.["category"])) : files;
  const filteredYouTubeRegularVideos = selectedCategory ? youTubeRegularVideos.filter(([, item]) => matchesCategory(item.attributes?.["category"])) : youTubeRegularVideos;
  const filteredYouTubeShortVideos = selectedCategory ? youTubeShortVideos.filter(([, item]) => matchesCategory(item.attributes?.["category"])) : youTubeShortVideos;

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
        items={categoryItems}
        selectedCategory={selectedCategory}
        onCategoryChange={(value) => {
          setSelectedCategory(value);
          if (value && controlGroupState === 4) {
            setControlGroupState(0);
          }
        }}
        onAttributeButtonClick={() => setControlGroupState(controlGroupState === 1 ? 0 : 1)}
        onEditAttributeButtonClick={() => {
          setControlGroupState(2);
          setOpen2(true);
        }}
        onDeleteButtonClick={() => setControlGroupState(controlGroupState === 3 ? 0 : 3)}
        onRearrangeButtonClick={() => setControlGroupState(controlGroupState === 4 ? 0 : 4)}
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
      <Dummy
        open={open2}
        setOpen={(value) => {
          setOpen2(value);
          setControlGroupState(0);
        }}
        selectedFolder={selectedFolder}
        updateFolderAttributes={updateFolderAttributes}
      />
      <Dummy2
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
    </LayoutPanel>
  );
};
