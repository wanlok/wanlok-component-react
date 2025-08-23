import { Box, Link, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useYouTube, YouTubeOEmbed, youTubeUrl } from "./useYouTube";
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
import CrossWhiteIcon from "../../assets/images/icons/cross-white.png";

const YouTubeList = ({
  document,
  onDeleteButtonClick
}: {
  document: { [key: string]: YouTubeOEmbed } | undefined;
  onDeleteButtonClick: (v: string) => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
        {document &&
          Object.entries(document).map(([v, youTubeOEmbed], index) => (
            <Stack sx={{ position: "relative", width: mobile ? "100%" : "calc(25% - 1px)" }} key={`youtube-${index}`}>
              <WButton
                onClick={() => onDeleteButtonClick(v)}
                sx={{ position: "absolute", top: 0, right: 0, width: 48, height: 48, backgroundColor: "black" }}
              >
                <Box component="img" src={CrossWhiteIcon} alt="" sx={{ width: "16px", height: "16px" }} />
              </WButton>
              <Link href={`${youTubeUrl}${v}`} sx={{ flex: 1, backgroundColor: "#000000", textDecoration: "none" }}>
                <Stack sx={{ aspectRatio: "16/9" }}>
                  <Box
                    component="img"
                    src={youTubeOEmbed.thumbnail_url}
                    alt=""
                    sx={{
                      display: "block",
                      objectFit: "cover",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                </Stack>
                <Stack sx={{ p: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#FFFFFF",
                      fontSize: 16
                    }}
                  >
                    {youTubeOEmbed.title}
                  </Typography>
                </Stack>
              </Link>
            </Stack>
          ))}
      </Stack>
    </Stack>
  );
};

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

export const Bookmarks = () => {
  const { folders, selectedFolder, addFolder, deleteFolder, openFolder } = useFolder();
  const { document, add, deleteVideo, exportUrls } = useYouTube(getDocumentId(selectedFolder));
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
      <YouTubeList document={document} onDeleteButtonClick={deleteVideo} />
      <TextInputForm
        placeholder="YouTube Links"
        rightButtons={[
          {
            label: "Add",
            onClickWithText: async (text) => await add(text)
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
