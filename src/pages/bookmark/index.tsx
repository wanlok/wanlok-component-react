import { Box, Stack, Typography } from "@mui/material";
import { useBookmark } from "./useBookmark";
import { TextInputForm } from "../../components/TextInputForm";
import { CardList } from "../../components/CardList";
import { useState } from "react";
import { LayoutPanel } from "../../components/LayoutPanel";
import { Folder, getDocumentId, useFolder } from "./useFolder";
import { WButton } from "../../components/WButton";
import FolderIcon from "../../assets/images/icons/folder.png";
import FolderSelectedIcon from "../../assets/images/icons/folder_selected.png";
import UpIcon from "../../assets/images/icons/up.png";
import DownIcon from "../../assets/images/icons/down.png";
import CrossIcon from "../../assets/images/icons/cross.png";
import Carousel from "react-material-ui-carousel";
import { groupList } from "../../common/ListDictUtils";
import { YouTubeVideo } from "../../components/YouTubeVideo";

const FolderRow = ({
  folder,
  selectedFolder,
  panelOpened
}: {
  folder: Folder;
  selectedFolder?: Folder;
  panelOpened?: boolean;
}) => {
  return (
    <Stack sx={{ flexDirection: "row", p: 2, gap: 2, alignItems: "center" }}>
      <Box
        component="img"
        src={folder === selectedFolder ? FolderSelectedIcon : FolderIcon}
        alt=""
        sx={{ width: "24px", height: "24px" }}
      />
      <Typography sx={{ flex: 1, fontSize: 16 }}>{folder.name}</Typography>
      {(panelOpened === true || panelOpened === false) && (
        <Box component="img" src={panelOpened ? UpIcon : DownIcon} alt="" sx={{ width: "16px", height: "16px" }} />
      )}
    </Stack>
  );
};

const FolderRowButtons = ({ folder, onDeleteClick }: { folder: Folder; onDeleteClick: (folder: Folder) => void }) => {
  return (
    <Stack>
      <WButton onClick={() => onDeleteClick(folder)} sx={{ flex: 1, p: 2, backgroundColor: "transparent" }}>
        <Box component="img" src={CrossIcon} alt="" sx={{ width: "16px", height: "16px" }} />
      </WButton>
    </Stack>
  );
};

const BookmarkList = ({
  youTubeRegularVideos,
  youTubeShortVideos,
  onDeleteButtonClick
}: {
  youTubeRegularVideos: [string, any][];
  youTubeShortVideos: [string, any][];
  onDeleteButtonClick: (type: string, id: string) => void;
}) => {
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ gap: "1px" }}>
        <Carousel
          indicators={false}
          autoPlay={false}
          navButtonsAlwaysVisible={true}
          cycleNavigation={true}
          animation="fade"
          duration={0}
        >
          {groupList(youTubeShortVideos, 4).map((group: [string, any][], i: number) => (
            <Stack key={`youtube-shorts-${i}`} sx={{ flexDirection: "row", gap: "1px" }}>
              {group.map(([id, youTubeOEmbed], j) => (
                <YouTubeVideo
                  key={`youtube-shorts-${i}-${j}`}
                  id={id}
                  youTubeOEmbed={youTubeOEmbed}
                  aspectRatio="9/16"
                  onDeleteButtonClick={() => onDeleteButtonClick("youtube_shorts", id)}
                />
              ))}
            </Stack>
          ))}
        </Carousel>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
          {youTubeRegularVideos.map(([id, youTubeOEmbed], i) => (
            <YouTubeVideo
              key={`youtube-regular-${i}`}
              id={id}
              youTubeOEmbed={youTubeOEmbed}
              aspectRatio="16/9"
              onDeleteButtonClick={() => onDeleteButtonClick("youtube_regular", id)}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export const Bookmarks = () => {
  const { folders, selectedFolder, addFolder, deleteFolder, openFolder } = useFolder();
  const { youTubeRegularVideos, youTubeShortVideos, addBookmarks, deleteBookmark, exportUrls } = useBookmark(
    getDocumentId(selectedFolder)
  );
  const [panelOpened, setPanelOpened] = useState(false);
  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <CardList
            items={folders}
            renderContent={(folder) => <FolderRow folder={folder} selectedFolder={selectedFolder} />}
            onContentClick={(folder) => {
              openFolder(folder);
              setPanelOpened(false);
            }}
            renderRightContent={(folder) => (
              <FolderRowButtons folder={folder} onDeleteClick={(folder) => deleteFolder(folder)} />
            )}
          />
          <TextInputForm
            placeholder="New Folder"
            rightButtons={[
              {
                label: "Add",
                onClickWithText: (text) => addFolder(text)
              }
            ]}
          />
        </>
      }
      topChildren={
        selectedFolder ? (
          <FolderRow folder={selectedFolder} selectedFolder={selectedFolder} panelOpened={panelOpened} />
        ) : (
          <></>
        )
      }
    >
      <BookmarkList
        youTubeRegularVideos={youTubeRegularVideos}
        youTubeShortVideos={youTubeShortVideos}
        onDeleteButtonClick={deleteBookmark}
      />
      <TextInputForm
        placeholder="Links"
        rightButtons={[
          {
            label: "Add",
            onClickWithText: async (text) => await addBookmarks(text)
          },
          {
            label: "Export",
            onClick: exportUrls
          }
        ]}
      />
    </LayoutPanel>
  );
};
