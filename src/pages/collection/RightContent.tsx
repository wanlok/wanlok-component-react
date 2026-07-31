import { useState } from "react";
import {
  ChartItem,
  CloudinaryFileInfo,
  CollectionAttributes,
  CollectionCounts,
  CollectionSequences,
  Direction,
  Folder,
  SteamInfo,
  TextRegion,
  YouTubeInfo
} from "../../services/Types";
import { CollectionList } from "./CollectionList";
import { ImageModal } from "./ImageModal";
import { VideoModal } from "./VideoModal";
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
  updateCollectionFile: (id: string, name: string, attributes: { [key: string]: string }, layout: string, textRegions: TextRegion[]) => Promise<void>;
  updateCollectionVideo: (
    type: "youtube_regular" | "youtube_shorts",
    id: string,
    name: string,
    attributes: { [key: string]: string }
  ) => Promise<void>;
}) => {
  const [selectedFile, setSelectedFile] = useState<{ id: string; src: string; name: string; attributes: { [key: string]: string }; layout: string; textRegions: TextRegion[] } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{
    type: "youtube_regular" | "youtube_shorts";
    id: string;
    name: string;
    attributes: { [key: string]: string };
  } | null>(null);

  return (
    <>
      <CollectionList
        onFileClick={(id, src, name) => {
          const file = files.find(([fileId]) => fileId === id);
          setSelectedFile({ id, src, name, attributes: file?.[1].attributes ?? {}, layout: file?.[1].layout ?? "default", textRegions: file?.[1].textRegions ?? [] });
        }}
        onVideoClick={(type, id, name, attributes) => setSelectedVideo({ type, id, name, attributes })}
        isLoading={isLoading}
        charts={charts}
        files={files}
        hyperlinks={hyperlinks}
        steam={steam}
        youTubeRegularVideos={youTubeRegularVideos}
        youTubeShortVideos={youTubeShortVideos}
        loadingCount={isLoading ? 8 : loadingCount}
        controlGroupState={controlGroupState}
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
      <ImageModal
        open={Boolean(selectedFile)}
        src={selectedFile?.src ?? ""}
        name={selectedFile?.name ?? ""}
        attributes={selectedFile?.attributes ?? {}}
        layout={selectedFile?.layout ?? "default"}
        textRegions={selectedFile?.textRegions ?? []}
        folderAttributes={selectedFolder?.attributes ?? []}
        onSaveButtonClick={async (name, attributes, layout, textRegions) => {
          if (selectedFile) {
            await updateCollectionFile(selectedFile.id, name, attributes, layout, textRegions);
          }
        }}
        onClose={() => setSelectedFile(null)}
      />
      <VideoModal
        open={Boolean(selectedVideo)}
        id={selectedVideo?.id ?? ""}
        name={selectedVideo?.name ?? ""}
        attributes={selectedVideo?.attributes ?? {}}
        folderAttributes={selectedFolder?.attributes ?? []}
        onSaveButtonClick={async (name, attributes) => {
          if (selectedVideo) {
            await updateCollectionVideo(selectedVideo.type, selectedVideo.id, name, attributes);
          }
        }}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
};
