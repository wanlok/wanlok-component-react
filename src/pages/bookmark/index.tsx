import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import { ImageTitleLink } from "../../components/ImageTitleLink";
import { WCarousel } from "../../components/WCarousel";
import { youTubeUrl } from "../../common/YouTube";
import { steamUrl } from "../../common/Steam";

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
  steam,
  onDeleteButtonClick
}: {
  youTubeRegularVideos: [string, any][];
  youTubeShortVideos: [string, any][];
  steam: [string, any][];
  onDeleteButtonClick: (type: string, id: string) => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const numberOfComponentsPerSlide = 4;
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ gap: "1px" }}>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
          {steam.map(([appId, { title, imageUrl }], i) => (
            <ImageTitleLink
              key={`steam-${i}`}
              title={title}
              imageUrl={imageUrl}
              href={`${steamUrl}${appId}`}
              width={mobile ? "100%" : "calc(25% - 1px)"}
              aspectRatio="92:43"
              onDeleteButtonClick={() => onDeleteButtonClick("steam", appId)}
            />
          ))}
        </Stack>
        <WCarousel
          list={youTubeShortVideos}
          numberOfComponentsPerSlide={mobile ? 2 : numberOfComponentsPerSlide}
          slideKey={(i) => `youtube-shorts-${i}`}
          renderContent={([id, { title, thumbnail_url }], i, j) => (
            <ImageTitleLink
              key={`youtube-shorts-${i}-${j}`}
              title={title}
              imageUrl={thumbnail_url}
              href={`${youTubeUrl}${id}`}
              width={mobile ? "50%" : `calc(${100 / numberOfComponentsPerSlide}% - 1px)`}
              aspectRatio="9/16"
              onDeleteButtonClick={() => onDeleteButtonClick("youtube_shorts", id)}
            />
          )}
        />
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
          {youTubeRegularVideos.map(([id, { title, thumbnail_url }], i) => (
            <ImageTitleLink
              key={`youtube-regular-${i}`}
              title={title}
              imageUrl={thumbnail_url}
              href={`${youTubeUrl}${id}`}
              width={mobile ? "100%" : "calc(25% - 1px)"}
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
  const { youTubeRegularVideos, youTubeShortVideos, steam, addBookmarks, deleteBookmark, exportUrls } = useBookmark(
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
        steam={steam}
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
