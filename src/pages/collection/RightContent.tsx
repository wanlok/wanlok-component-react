import { LayoutLoading } from "../../components/LayoutLoading";
import {
  ChartItem,
  CloudinaryFileInfo,
  CollectionCounts,
  Direction,
  Folder,
  SteamInfo,
  YouTubeOEmbed
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
  controlGroupState,
  selectedFolder,
  setCollectionTypeId,
  deleteCollectionItem,
  updateFolderCounts,
  updateCollectionSequences,
  addCollectionItems,
  addCollectionFiles
}: {
  isLoading: boolean;
  charts: [string, ChartItem][];
  files: [string, CloudinaryFileInfo][];
  hyperlinks: [string, string][];
  steam: [string, SteamInfo][];
  youTubeRegularVideos: [string, YouTubeOEmbed][];
  youTubeShortVideos: [string, YouTubeOEmbed][];
  controlGroupState: number;
  selectedFolder: Folder | undefined;
  setCollectionTypeId: (value: { type: string; id: string } | undefined) => void;
  deleteCollectionItem: (type: string, id: string) => Promise<CollectionCounts | undefined>;
  updateFolderCounts: (counts: CollectionCounts) => Promise<void>;
  updateCollectionSequences: (type: string, id: string, direction: Direction) => void;
  addCollectionItems: (collectionId: string, text: string) => Promise<CollectionCounts | undefined>;
  addCollectionFiles: (collectionId: string) => Promise<CollectionCounts | undefined>;
}) => {
  if (isLoading) {
    return <LayoutLoading />;
  }
  return (
    <>
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
      </StyledContainer>
    </>
  );
};
