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
import HyperlinkIcon from "../../assets/images/icons/hyperlink.png";
import SteamIcon from "../../assets/images/icons/steam.png";
import YouTubeIcon from "../../assets/images/icons/youtube.png";
import SendIcon from "../../assets/images/icons/send.png";
import UploadIcon from "../../assets/images/icons/upload.png";
import DownloadIcon from "../../assets/images/icons/download.png";
import GreenCircleIcon from "../../assets/images/icons/green_circle.png";
import RedCircleIcon from "../../assets/images/icons/red_circle.png";
import { WChip } from "../../components/WChip";
import { Direction, Folder } from "../../services/Types";
import { CollectionList } from "./CollectionList";

const FolderRow = ({
  folder,
  selectedFolder,
  panelOpened
}: {
  folder: Folder;
  selectedFolder?: Folder;
  panelOpened?: boolean;
}) => {
  const { hyperlinks, steam, youtube_regular, youtube_shorts } = folder.counts;
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
        {panelOpened === undefined && Object.values(folder.counts).some((count) => count > 0) && (
          <Stack sx={{ flexDirection: "row", gap: 1 }}>
            {hyperlinks > 0 && <WChip icon={HyperlinkIcon} label={`${hyperlinks}`} />}
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

export const CollectionPage = () => {
  const {
    serverHealth,
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
    addCollectionItems,
    addCollectionFiles,
    updateCollection,
    deleteCollectionItem
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
                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ flex: 1, fontSize: 16, p: 1 }}>Collections</Typography>
                  <WChip icon={FolderSelectedIcon} label={`${folders.length}`} />
                  <WChip icon={serverHealth ? GreenCircleIcon : RedCircleIcon} label={"Server"} />
                </Stack>
              </Stack>
            )}
            <Stack
              sx={{ flexDirection: "row", alignItems: "center", gap: "1px", backgroundColor: "background.default" }}
            >
              <WIconButton
                icon={UploadIcon}
                iconSize={18}
                onClick={uploadFolders}
                sx={{ backgroundColor: "primary.main" }}
              />
              <WIconButton
                icon={DownloadIcon}
                iconSize={18}
                onClick={downloadFolders}
                sx={{ backgroundColor: "primary.main" }}
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
          const counts = await deleteCollectionItem(type, id);
          if (counts) {
            await updateFolderCounts(counts);
          }
        }}
      />
      <TextInputForm
        placeholder="Links"
        rightButtons={[
          {
            icon: SendIcon,
            size: 18,
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
