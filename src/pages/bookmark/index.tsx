import { Box, Link, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useYouTube, YouTubeDocument, youTubeUrl } from "./useYouTube";
import { TextInputForm } from "../../components/TextInputForm";
import { CardList } from "../../components/CardList";
import { useState } from "react";
import { LayoutPanel } from "../../components/LayoutPanel";
import { Folder, useFolder } from "./useFolder";
import { WButton } from "../../components/WButton";
import FolderIcon from "../../assets/images/icons/folder.png";
import CrossIcon from "../../assets/images/icons/cross.png";
import CrossWhiteIcon from "../../assets/images/icons/cross-white.png";

const YouTubeList = ({
  document,
  onDeleteButtonClick
}: {
  document: YouTubeDocument | undefined;
  onDeleteButtonClick: (v: string) => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
        {document &&
          Object.entries(document).map(([v, youTubeOEmbed], index) => (
            <Stack sx={{ position: "relative", width: mobile ? "100%" : "calc(25% - 1px)" }}>
              <WButton
                onClick={() => onDeleteButtonClick(v)}
                sx={{ position: "absolute", top: 0, right: 0, width: 40, height: 40, backgroundColor: "black" }}
              >
                <Box component="img" src={CrossWhiteIcon} alt="" sx={{ width: "16px", height: "16px" }} />
              </WButton>
              <Link
                key={`youtube-${index}`}
                href={`${youTubeUrl}${v}`}
                sx={{ backgroundColor: "#000000", textDecoration: "none" }}
              >
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

const FolderRow = ({ folder }: { folder: Folder }) => {
  return (
    <Stack sx={{ flexDirection: "row", p: 2, gap: 2, alignItems: "center" }}>
      <Box component="img" src={FolderIcon} alt="" sx={{ width: "24px", height: "24px" }} />
      <Typography sx={{ fontSize: 16 }}>{folder.name}</Typography>
    </Stack>
  );
};

const FolderRowButtons = ({ folder, onDeleteClick }: { folder: Folder; onDeleteClick: (folder: Folder) => void }) => {
  return (
    <Stack>
      <WButton onClick={() => onDeleteClick(folder)} sx={{ flex: 1, width: 40, p: 0, backgroundColor: "transparent" }}>
        <Box component="img" src={CrossIcon} alt="" sx={{ width: "14px", height: "14px" }} />
      </WButton>
    </Stack>
  );
};

export const YouTube = () => {
  const { folders, selectedFolder, setSelectedFolder, addFolder, deleteFolder } = useFolder();
  const { document, add, deleteVideo, exportUrls } = useYouTube(selectedFolder?.name);
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
            renderContent={(folder) => <FolderRow folder={folder} />}
            onContentClick={(folder) => {
              folder && setSelectedFolder(folder);
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
      topChildren={selectedFolder ? <FolderRow folder={selectedFolder} /> : <></>}
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
