import { LayoutLoading } from "../../components/LayoutLoading";
import { Direction, Folder } from "../../services/Types";
import { CollectionList } from "./CollectionList";
import { WText } from "../../components/WText";
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
  charts: [string, any][];
  files: [string, any][];
  hyperlinks: [string, any][];
  steam: [string, any][];
  youTubeRegularVideos: [string, any][];
  youTubeShortVideos: [string, any][];
  controlGroupState: number;
  selectedFolder: Folder | undefined;
  setCollectionTypeId: (value: { type: string; id: string } | undefined) => void;
  deleteCollectionItem: (type: string, id: string) => Promise<any>;
  updateFolderCounts: (counts: any) => Promise<void>;
  updateCollectionSequences: (type: string, id: string, direction: Direction) => void;
  addCollectionItems: (collectionId: string, text: string) => Promise<any>;
  addCollectionFiles: (collectionId: string) => Promise<any>;
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
    </>
  );
};
