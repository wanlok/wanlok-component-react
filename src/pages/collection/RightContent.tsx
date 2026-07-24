import { Skeleton, Stack } from "@mui/material";
import {
  ChartItem,
  CloudinaryFileInfo,
  CollectionCounts,
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

const CollectionSkeleton = () => {
  const gridTemplateColumns = { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" };
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ display: "grid", gridTemplateColumns, gap: "1px" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            sx={{ aspectRatio: "16/10", width: "100%", height: "auto", bgcolor: "divider" }}
          />
        ))}
      </Stack>
    </Stack>
  );
};

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
  youTubeRegularVideos: [string, YouTubeInfo][];
  youTubeShortVideos: [string, YouTubeInfo][];
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
    return <CollectionSkeleton />;
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
      )}
    </>
  );
};
