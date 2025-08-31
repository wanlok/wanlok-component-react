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
import { Direction, FileInfo, Folder, viewUrls } from "../../services/Types";
import { WChart } from "../../components/WChart";
import { seperate } from "../../common/LayoutUtils";
import { getFileExtension } from "../../common/FileUtils";

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
  files,
  hyperlinks,
  steam,
  youTubeRegularVideos,
  youTubeShortVideos,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  charts: [string, any][];
  files: [string, FileInfo][];
  hyperlinks: [string, string][];
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
  const list = [charts, files, hyperlinks, steam, youTubeShortVideos, youTubeRegularVideos];
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, charts) }}>
          {charts.map(([uuid, chartItem], i) => (
            <WChart
              key={`chart-${i}`}
              chartItem={chartItem}
              width={mobile ? "100%" : "calc(50% - 1px)"}
              leftMost={i === 0}
              rightMost={i === charts.length - 1}
              scrollHorizontally={false}
              onLeftButtonClick={() => onLeftButtonClick("charts", uuid)}
              onRightButtonClick={() => onRightButtonClick("charts", uuid)}
              onDeleteButtonClick={() => onDeleteButtonClick("charts", uuid)}
            />
          ))}
        </Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, files) }}>
          {files.map(([id, { name, mime_type }], i) => {
            const imageUrl = `${viewUrls.files}${id}${getFileExtension(mime_type)}`;
            return (
              <ImageTitleLink
                key={`files-${i}`}
                imageUrl={imageUrl}
                imageSx={{ objectPosition: "top" }}
                title={name}
                href={imageUrl}
                width={mobile ? "100%" : "calc(25% - 1px)"}
                aspectRatio={"16/9"}
                leftMost={i === 0}
                rightMost={i === files.length - 1}
                scrollHorizontally={false}
                onLeftButtonClick={() => onLeftButtonClick("files", id)}
                onRightButtonClick={() => onRightButtonClick("files", id)}
                onDeleteButtonClick={() => onDeleteButtonClick("files", id)}
              />
            );
          })}
        </Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, hyperlinks) }}>
          {hyperlinks.map(([url, id], i) => (
            <ImageTitleLink
              key={`hyperlinks-${i}`}
              imageUrl={`${"https://wanlok.ddns.net/screenshot/"}${id}.png`}
              title={url}
              href={url}
              width={mobile ? "100%" : "calc(25% - 1px)"}
              aspectRatio={"16/9"}
              leftMost={i === 0}
              rightMost={i === hyperlinks.length - 1}
              scrollHorizontally={false}
              onLeftButtonClick={() => onLeftButtonClick("hyperlinks", url)}
              onRightButtonClick={() => onRightButtonClick("hyperlinks", url)}
              onDeleteButtonClick={() => onDeleteButtonClick("hyperlinks", url)}
            />
          ))}
        </Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, steam) }}>
          {steam.map(([appId, { title, imageUrl }], i) => (
            <ImageTitleLink
              key={`steam-${i}`}
              imageUrl={imageUrl}
              title={title}
              href={`${viewUrls.steam}${appId}`}
              width={mobile ? "100%" : "calc(25% - 1px)"}
              aspectRatio="92/43"
              leftMost={i === 0}
              rightMost={i === steam.length - 1}
              scrollHorizontally={false}
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
              imageUrl={thumbnail_url}
              title={title}
              href={`${viewUrls.youtube_shorts}${id}`}
              width={mobile ? "50%" : `calc(${100 / numberOfComponentsPerSlide}% - 1px)`}
              aspectRatio="9/16"
              leftMost={i === 0 && j === 0}
              scrollHorizontally={true}
              rightMost={i * numberOfComponentsPerSlide + j === youTubeShortVideos.length - 1}
              onLeftButtonClick={() => onLeftButtonClick("youtube_shorts", id)}
              onRightButtonClick={() => onRightButtonClick("youtube_shorts", id)}
              onDeleteButtonClick={() => onDeleteButtonClick("youtube_shorts", id)}
            />
          )}
          sx={{ mt: seperate(list, youTubeShortVideos) }}
        />
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, youTubeRegularVideos) }}>
          {youTubeRegularVideos.map(([id, { title, thumbnail_url }], i) => (
            <ImageTitleLink
              key={`youtube-regular-${i}`}
              imageUrl={thumbnail_url}
              title={title}
              href={`${viewUrls.youtube_regular}${id}`}
              width={mobile ? "100%" : "calc(25% - 1px)"}
              aspectRatio="16/9"
              leftMost={i === 0}
              rightMost={i === youTubeRegularVideos.length - 1}
              scrollHorizontally={false}
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
    files,
    hyperlinks,
    steam,
    youTubeRegularVideos,
    youTubeShortVideos,
    addCollections,
    addCollectionFiles,
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
            rightButtons={[{ label: "Add", onClickWithText: (text) => addFolder(text) }]}
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
        files={files}
        hyperlinks={hyperlinks}
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
          },
          {
            icon: UploadIcon,
            size: 18,
            onClick: async () => {
              const collectionId = getDocumentId(selectedFolder?.name);
              if (collectionId) {
                addCollectionFiles(collectionId);
              }
            }
          }
        ]}
      />
    </LayoutPanel>
  );
};
