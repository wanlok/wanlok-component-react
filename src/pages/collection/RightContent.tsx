import { useNavigate, useParams } from "react-router-dom";
import {
  ChartItem,
  CloudinaryFileInfo,
  CollectionAttributes,
  CollectionCounts,
  CollectionSequences,
  Direction,
  Folder,
  Region,
  SteamInfo,
  YouTubeInfo
} from "../../services/Types";
import { CollectionList } from "./CollectionList";
import { ImageRecognitionModal } from "./ImageRecognitionModal";
import { YouTubeModal } from "./YouTubeModal";
import { TextInputWithButtons } from "../../components/TextInputWithButtons";
import { StyledContainer } from "../../components/StyledContainer";
import { getDocumentId } from "./useFolder";
import { Send as SendIcon, Upload as UploadIcon } from "@mui/icons-material";

export const RightContent = ({
  isLoading,
  charts,
  files,
  hyperlinks,
  steam,
  youTubeRegularVideos,
  youTubeShortVideos,
  loadingCount,
  controlGroupState,
  selectedFolder,
  deleteCollectionItem,
  updateFolder,
  updateCollectionSequences,
  addCollectionItems,
  addCollectionFiles,
  updateCollectionFile,
  updateCollectionVideo
}: {
  isLoading: boolean;
  charts: [string, ChartItem][];
  files: [string, CloudinaryFileInfo][];
  hyperlinks: [string, string][];
  steam: [string, SteamInfo][];
  youTubeRegularVideos: [string, YouTubeInfo][];
  youTubeShortVideos: [string, YouTubeInfo][];
  loadingCount: number;
  controlGroupState: number;
  selectedFolder: Folder | undefined;
  deleteCollectionItem: (type: string, id: string) => Promise<CollectionCounts | undefined>;
  updateFolder: (params: { counts?: CollectionCounts; sequences?: Partial<CollectionSequences>; attributes?: CollectionAttributes }) => Promise<void>;
  updateCollectionSequences: (type: string, id: string, direction: Direction) => void;
  addCollectionItems: (collectionId: string, text: string) => Promise<CollectionCounts | undefined>;
  addCollectionFiles: (collectionId: string) => Promise<{ counts: CollectionCounts; sequences?: string[]; attributes?: CollectionAttributes } | undefined>;
  updateCollectionFile: (
    id: string,
    name: string,
    previewAlignment: string,
    attributes: { [key: string]: string },
    layout: string,
    regions: Region[]
  ) => Promise<void>;
  updateCollectionVideo: (
    type: "youtubeRegular" | "youtubeShorts",
    id: string,
    name: string,
    attributes: { [key: string]: string }
  ) => Promise<void>;
}) => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const folderId = getDocumentId(selectedFolder?.name);

  const file = itemId ? files.find(([id]) => id === itemId) : undefined;
  const selectedFile: {
    id: string;
    src: string;
    name: string;
    previewAlignment: string;
    attributes: { [key: string]: string };
    layout: string;
    regions: Region[];
    type: string;
  } | null = file
    ? {
        id: file[0],
        src: file[1].url,
        name: file[1].name,
        previewAlignment: file[1].previewAlignment ?? "top",
        attributes: file[1].attributes ?? {},
        layout: file[1].layout ?? "default",
        regions: file[1].regions ?? [],
        type: file[1].mimeType
      }
    : null;

  const shortVideo = !file && itemId ? youTubeShortVideos.find(([id]) => id === itemId) : undefined;
  const regularVideo = !file && !shortVideo && itemId ? youTubeRegularVideos.find(([id]) => id === itemId) : undefined;
  const selectedVideo: { type: "youtubeRegular" | "youtubeShorts"; id: string; name: string; attributes: { [key: string]: string } } | null = shortVideo
    ? { type: "youtubeShorts", id: shortVideo[0], name: shortVideo[1].name, attributes: shortVideo[1].attributes ?? {} }
    : regularVideo
      ? { type: "youtubeRegular", id: regularVideo[0], name: regularVideo[1].name, attributes: regularVideo[1].attributes ?? {} }
      : null;

  const previewableItems: { type: "files" | "youtubeShorts" | "youtubeRegular"; id: string }[] = [
    ...files.map(([id]): { type: "files"; id: string } => ({ type: "files", id })),
    ...youTubeShortVideos.map(([id]): { type: "youtubeShorts"; id: string } => ({ type: "youtubeShorts", id })),
    ...youTubeRegularVideos.map(([id]): { type: "youtubeRegular"; id: string } => ({ type: "youtubeRegular", id }))
  ];
  const selectedItemIndex = itemId ? previewableItems.findIndex((item) => item.id === itemId) : -1;
  const previousItem = selectedItemIndex > 0 ? previewableItems[selectedItemIndex - 1] : undefined;
  const nextItem =
    selectedItemIndex >= 0 && selectedItemIndex < previewableItems.length - 1
      ? previewableItems[selectedItemIndex + 1]
      : undefined;

  const navigateToItem = (item: { type: "files" | "youtubeShorts" | "youtubeRegular"; id: string } | undefined) => {
    if (!item || !folderId) {
      return;
    }
    navigate(item.type === "files" ? `/collections/${folderId}/${item.id}/details` : `/collections/${folderId}/${item.id}`);
  };

  return (
    <>
      <CollectionList
        onFileClick={(id) => {
          if (folderId) {
            navigate(`/collections/${folderId}/${id}/details`);
          }
        }}
        onVideoClick={(_type, id) => {
          if (folderId) {
            navigate(`/collections/${folderId}/${id}`);
          }
        }}
        charts={charts}
        files={files}
        hyperlinks={hyperlinks}
        steam={steam}
        youTubeRegularVideos={youTubeRegularVideos}
        youTubeShortVideos={youTubeShortVideos}
        loadingCount={isLoading || !selectedFolder ? 8 : loadingCount}
        controlGroupState={controlGroupState}
        folderAttributes={selectedFolder?.attributes ?? []}
        onDeleteButtonClick={async (type, id) => {
          const counts = await deleteCollectionItem(type, id);
          if (counts) {
            await updateFolder({ counts });
          }
        }}
        onLeftButtonClick={(type, id) => updateCollectionSequences(type, id, Direction.left)}
        onRightButtonClick={(type, id) => updateCollectionSequences(type, id, Direction.right)}
      />
      {selectedFolder && (
        <StyledContainer>
          <TextInputWithButtons
            placeholder="Add Links or Upload Files"
            rightButtons={[
              {
                icon: <SendIcon sx={{ fontSize: 20 }} />,
                onClickWithText: async (text) => {
                  const collectionId = getDocumentId(selectedFolder?.name);
                  if (collectionId) {
                    const counts = await addCollectionItems(collectionId, text);
                    if (counts) {
                      await updateFolder({ counts });
                    }
                  }
                }
              },
              {
                icon: <UploadIcon sx={{ fontSize: 24 }} />,
                onClick: async () => {
                  const collectionId = getDocumentId(selectedFolder?.name);
                  if (collectionId) {
                    const result = await addCollectionFiles(collectionId);
                    if (result) {
                      const { counts, sequences, attributes } = result;
                      let mergedAttributes: CollectionAttributes | undefined;
                      if (attributes && selectedFolder) {
                        const existingNames = new Set(selectedFolder.attributes.map((a) => a.name));
                        const newAttributes = attributes.filter((a) => !existingNames.has(a.name));
                        if (newAttributes.length > 0) {
                          mergedAttributes = [...selectedFolder.attributes, ...newAttributes];
                        }
                      }
                      await updateFolder({
                        counts,
                        sequences: sequences ? { files: sequences } : undefined,
                        attributes: mergedAttributes
                      });
                    }
                  }
                }
              }
            ]}
          />
        </StyledContainer>
      )}
      <ImageRecognitionModal
        key={`image-${selectedFile ? selectedFile.id : "closed"}`}
        open={Boolean(selectedFile)}
        src={selectedFile?.src ?? ""}
        name={selectedFile?.name ?? ""}
        previewAlignment={selectedFile?.previewAlignment ?? "top"}
        attributes={selectedFile?.attributes ?? {}}
        layout={selectedFile?.layout ?? "default"}
        regions={selectedFile?.regions ?? []}
        folderAttributes={selectedFolder?.attributes ?? []}
        type={selectedFile?.type ?? ""}
        onPreviousClick={previousItem ? () => navigateToItem(previousItem) : undefined}
        onNextClick={nextItem ? () => navigateToItem(nextItem) : undefined}
        onSaveButtonClick={async (name, previewAlignment, attributes, layout, regions) => {
          if (selectedFile) {
            await updateCollectionFile(selectedFile.id, name, previewAlignment, attributes, layout, regions);
          }
        }}
        onClose={() => {
          if (folderId) {
            navigate(`/collections/${folderId}`);
          }
        }}
      />
      <YouTubeModal
        key={`youtube-${selectedVideo ? selectedVideo.id : "closed"}`}
        open={Boolean(selectedVideo)}
        id={selectedVideo?.id ?? ""}
        name={selectedVideo?.name ?? ""}
        attributes={selectedVideo?.attributes ?? {}}
        folderAttributes={selectedFolder?.attributes ?? []}
        onPreviousClick={previousItem ? () => navigateToItem(previousItem) : undefined}
        onNextClick={nextItem ? () => navigateToItem(nextItem) : undefined}
        onSaveButtonClick={async (name, attributes) => {
          if (selectedVideo) {
            await updateCollectionVideo(selectedVideo.type, selectedVideo.id, name, attributes);
          }
        }}
        onClose={() => {
          if (folderId) {
            navigate(`/collections/${folderId}`);
          }
        }}
      />
    </>
  );
};
