import { Box, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useCollection } from "./useCollection";
import { TextInputForm } from "../../components/TextInputForm";
import { WCardList } from "../../components/WCardList";
import { useState } from "react";
import { LayoutPanel } from "../../components/LayoutPanel";
import { getDocumentId, useFolder } from "./useFolder";
import { WIconButton } from "../../components/WButton";
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
import { Direction, Folder, viewUrls } from "../../common/WTypes";
import { WChart } from "../../components/WChart";

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

const CollectionList = ({
  charts,
  steam,
  youTubeRegularVideos,
  youTubeShortVideos,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  charts: [string, any][];
  steam: [string, any][];
  youTubeRegularVideos: [string, any][];
  youTubeShortVideos: [string, any][];
  onLeftButtonClick: (type: string, id: string) => void;
  onRightButtonClick: (type: string, id: string) => void;
  onDeleteButtonClick: (type: string, id: string) => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const numberOfComponentsPerSlide = 4;
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
          {charts.map(([uuid, chartItem], i) => (
            <WChart
              key={`chart-${i}`}
              chartItem={chartItem}
              width={mobile ? "100%" : "calc(50% - 1px)"}
              leftMost={i === 0}
              rightMost={i === charts.length - 1}
              onLeftButtonClick={() => onLeftButtonClick("charts", uuid)}
              onRightButtonClick={() => onRightButtonClick("charts", uuid)}
              onDeleteButtonClick={() => onDeleteButtonClick("charts", uuid)}
            />
          ))}
        </Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
          {steam.map(([appId, { title, imageUrl }], i) => (
            <ImageTitleLink
              key={`steam-${i}`}
              title={title}
              imageUrl={imageUrl}
              href={`${viewUrls.steam}${appId}`}
              width={mobile ? "100%" : "calc(25% - 1px)"}
              aspectRatio="92:43"
              leftMost={i === 0}
              rightMost={i === steam.length - 1}
              onLeftButtonClick={() => onLeftButtonClick("steam", appId)}
              onRightButtonClick={() => onRightButtonClick("steam", appId)}
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
              leftMost={i === 0 && j == 0}
              rightMost={i * numberOfComponentsPerSlide + j === youTubeShortVideos.length - 1}
              onLeftButtonClick={() => onLeftButtonClick("youtube_shorts", id)}
              onRightButtonClick={() => onRightButtonClick("youtube_shorts", id)}
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
              leftMost={i === 0}
              rightMost={i === youTubeRegularVideos.length - 1}
              onLeftButtonClick={() => onLeftButtonClick("youtube_regular", id)}
              onRightButtonClick={() => onRightButtonClick("youtube_regular", id)}
              onDeleteButtonClick={() => onDeleteButtonClick("youtube_regular", id)}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export const CollectionPage = () => {
  const {
    folders,
    selectedFolder,
    addFolder,
    updateFolderSequences,
    updateFolderCounts,
    deleteFolder,
    openFolder,
    uploadFolders,
    downloadFolder,
    downloadFolders
  } = useFolder();
  const {
    charts,
    steam,
    youTubeRegularVideos,
    youTubeShortVideos,
    addCollections,
    updateCollection,
    deleteCollection
  } = useCollection(getDocumentId(selectedFolder?.name), selectedFolder?.sequences, updateFolderSequences);
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
              <Stack sx={{ flex: 1, justifyContent: "center", px: 1, backgroundColor: "background.default" }}>
                <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                  <Typography sx={{ flex: 1, fontSize: 16, p: 1 }}>Collections</Typography>
                  <WChip icon={FolderSelectedIcon} label={`${folders.length}`} />
                </Stack>
              </Stack>
            )}
            <Stack sx={{ flexDirection: "row", gap: "1px", backgroundColor: "background.default" }}>
              <WIconButton
                icon={UploadIcon}
                buttonSize={50}
                iconSize={18}
                onClick={uploadFolders}
                sx={{ backgroundColor: "primray.main" }}
              />
              <WIconButton
                icon={DownloadIcon}
                buttonSize={50}
                iconSize={18}
                onClick={downloadFolders}
                sx={{ backgroundColor: "primray.main" }}
              />
            </Stack>
          </Stack>
          <WCardList
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
      <CollectionList
        charts={charts}
        steam={steam}
        youTubeRegularVideos={youTubeRegularVideos}
        youTubeShortVideos={youTubeShortVideos}
        onLeftButtonClick={(type, id) => updateCollection(type, id, Direction.left)}
        onRightButtonClick={(type, id) => updateCollection(type, id, Direction.right)}
        onDeleteButtonClick={async (type, id) => {
          const counts = await deleteCollection(type, id);
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
              const collectionId = getDocumentId(selectedFolder?.name);
              if (collectionId) {
                const counts = await addCollections(collectionId, text);
                if (counts) {
                  await updateFolderCounts(counts);
                }
              }
            }
          }
        ]}
      />
    </LayoutPanel>
  );
};
