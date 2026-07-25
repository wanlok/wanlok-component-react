import {
  ChartItem,
  CloudinaryFileInfo,
  CollectionAttributes,
  CollectionCounts,
  CollectionSequences,
  Direction,
  Folder,
  SteamInfo,
  YouTubeInfo
} from "../../services/Types";
import { CollectionList } from "./CollectionList";
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
  setCollectionTypeId,
  deleteCollectionItem,
  updateFolder,
  updateCollectionSequences,
  addCollectionItems,
  addCollectionFiles
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
  setCollectionTypeId: (value: { type: string; id: string } | undefined) => void;
  deleteCollectionItem: (type: string, id: string) => Promise<CollectionCounts | undefined>;
  updateFolder: (params: { counts?: CollectionCounts; sequences?: Partial<CollectionSequences>; attributes?: CollectionAttributes }) => Promise<void>;
  updateCollectionSequences: (type: string, id: string, direction: Direction) => void;
  addCollectionItems: (collectionId: string, text: string) => Promise<CollectionCounts | undefined>;
  addCollectionFiles: (collectionId: string) => Promise<{ counts: CollectionCounts; sequences?: string[]; attributes?: CollectionAttributes } | undefined>;
}) => {
  return (
    <>
      <CollectionList
        isLoading={isLoading}
        charts={charts}
        files={files}
        hyperlinks={hyperlinks}
        steam={steam}
        youTubeRegularVideos={youTubeRegularVideos}
        youTubeShortVideos={youTubeShortVideos}
        loadingCount={isLoading ? 8 : loadingCount}
        controlGroupState={controlGroupState}
        onDetailsButtonClick={(type, id) => setCollectionTypeId({ type, id })}
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
    </>
  );
};
