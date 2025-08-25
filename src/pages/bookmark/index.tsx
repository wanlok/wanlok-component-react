import { Box, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useBookmark } from "./useBookmark";
import { TextInputForm } from "../../components/TextInputForm";
import { CardList } from "../../components/CardList";
import { useState } from "react";
import { LayoutPanel } from "../../components/LayoutPanel";
import { Folder, getDocumentId, useFolder } from "./useFolder";
import { WButton, WIconButton } from "../../components/WButton";
import FolderIcon from "../../assets/images/icons/folder.png";
import FolderSelectedIcon from "../../assets/images/icons/folder_selected.png";
import UpIcon from "../../assets/images/icons/up.png";
import DownIcon from "../../assets/images/icons/down.png";
import CrossIcon from "../../assets/images/icons/cross.png";
import { ImageTitleLink } from "../../components/ImageTitleLink";
import { WCarousel } from "../../components/WCarousel";
import SteamIcon from "../../assets/images/icons/steam.png";
import YouTubeIcon from "../../assets/images/icons/youtube.png";
import UploadIcon from "../../assets/images/icons/upload.png";
import DownloadIcon from "../../assets/images/icons/download.png";
import { WChip } from "../../components/WChip";
import { viewUrls } from "../../common/Bookmark";

const FolderRow = ({
  folder,
  selectedFolder,
  panelOpened
}: {
  folder: Folder;
  selectedFolder?: Folder;
  panelOpened?: boolean;
}) => {
  const { steam, youtube_regular, youtube_shorts } = folder.counts;
  const mobileRow = panelOpened === true || panelOpened === false;
  return (
    <Stack
      sx={{
        flexDirection: "row",
        minHeight: (mobileRow ? 48 : 48 + 48 + 1) + "px",
        py: 2,
        pl: 2,
        pr: mobileRow ? 2 : 0,
        gap: 2,
        boxSizing: "border-box",
        backgroundColor: mobileRow ? "background.default" : "transparent"
      }}
    >
      <Box
        component="img"
        src={folder === selectedFolder ? FolderSelectedIcon : FolderIcon}
        alt=""
        sx={{ width: "24px", height: "24px" }}
      />
      <Stack sx={{ flex: 1, gap: 1, pr: 2 }}>
        <Typography sx={{ fontSize: 16 }}>{folder.name}</Typography>
        {panelOpened === undefined && (steam > 0 || youtube_regular > 0 || youtube_shorts > 0) && (
          <Stack sx={{ flexDirection: "row", gap: 1 }}>
            {steam > 0 && <WChip icon={SteamIcon} label={`${steam}`} />}
            {youtube_regular > 0 && youtube_shorts > 0 && (
              <WChip icon={YouTubeIcon} label={`${youtube_shorts} + ${youtube_regular}`} />
            )}
            {youtube_regular === 0 && youtube_shorts > 0 && <WChip icon={YouTubeIcon} label={`${youtube_shorts}`} />}
            {youtube_regular > 0 && youtube_shorts === 0 && <WChip icon={YouTubeIcon} label={`${youtube_regular}`} />}
          </Stack>
        )}
      </Stack>
      {mobileRow && (
        <Box
          component="img"
          src={panelOpened ? UpIcon : DownIcon}
          alt=""
          sx={{ width: "16px", height: "16px", mt: "4px" }}
        />
      )}
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
      <Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
          {steam.map(([appId, { title, imageUrl }], i) => (
            <ImageTitleLink
              key={`steam-${i}`}
              title={title}
              imageUrl={imageUrl}
              href={`${viewUrls.steam}${appId}`}
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
              href={`${viewUrls.youtube_shorts}${id}`}
              width={mobile ? "50%" : `calc(${100 / numberOfComponentsPerSlide}% - 1px)`}
              aspectRatio="9/16"
              onDeleteButtonClick={() => onDeleteButtonClick("youtube_shorts", id)}
            />
          )}
          sx={{ mt: steam.length > 0 ? "1px" : 0 }}
        />
        <Stack
          sx={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "1px",
            mt: steam.length > 0 || youTubeShortVideos.length > 0 ? "1px" : 0
          }}
        >
          {youTubeRegularVideos.map(([id, { title, thumbnail_url }], i) => (
            <ImageTitleLink
              key={`youtube-regular-${i}`}
              title={title}
              imageUrl={thumbnail_url}
              href={`${viewUrls.youtube_regular}${id}`}
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
  const {
    folders,
    selectedFolder,
    addFolder,
    updateFolderCounts,
    deleteFolder,
    openFolder,
    downloadFolder,
    downloadFolders
  } = useFolder();
  const { steam, youTubeRegularVideos, youTubeShortVideos, addBookmarks, deleteBookmark } = useBookmark(
    getDocumentId(selectedFolder)
  );
  const [panelOpened, setPanelOpened] = useState(false);
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={300}
      panel={
        <>
          <Stack sx={mobile ? {} : { height: 100 }}>
            {!mobile && (
              <Stack
                sx={{
                  flex: 1,
                  justifyContent: "center",
                  boxSizing: "border-box",
                  px: 2,
                  backgroundColor: "background.default"
                }}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>{folders.length} Folders</Typography>
              </Stack>
            )}
            <Stack sx={{ flexDirection: "row", gap: "1px", backgroundColor: "background.default" }}>
              <WButton
                sx={{ flex: 1, height: 48 }}
                rightIcon={<img src={UploadIcon} alt="icon" style={{ width: 18, height: 18 }} />}
              >
                Upload
              </WButton>
              <WButton
                sx={{ flex: 1, height: 48, gap: "4px" }}
                rightIcon={<img src={DownloadIcon} alt="icon" style={{ width: 18, height: 18 }} />}
                onClick={downloadFolders}
              >
                Download
              </WButton>
            </Stack>
          </Stack>
          <CardList
            items={folders}
            renderContent={(folder) => <FolderRow folder={folder} selectedFolder={selectedFolder} />}
            onContentClick={(folder) => {
              openFolder(folder);
              setPanelOpened(false);
            }}
            renderRightContent={(folder) => (
              <Stack sx={{}}>
                <WIconButton icon={CrossIcon} iconSize={16} onClick={() => deleteFolder(folder)} />
                <Divider />
                <WIconButton icon={DownloadIcon} iconSize={18} onClick={() => downloadFolder(folder)} />
              </Stack>
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
        onDeleteButtonClick={async (type, id) => {
          const counts = await deleteBookmark(type, id);
          if (counts) {
            await updateFolderCounts(counts);
          }
        }}
      />
      <TextInputForm
        placeholder="Links"
        rightButtons={[
          {
            label: "Add",
            onClickWithText: async (text) => {
              const counts = await addBookmarks(text);
              if (counts) {
                await updateFolderCounts(counts);
              }
            }
          }
        ]}
      />
    </LayoutPanel>
  );
};
