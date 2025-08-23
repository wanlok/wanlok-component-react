import { Box, Link, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useYouTube, YouTubeDocument, youTubeUrl } from "./useYouTube";
import { TextInputForm } from "../../components/TextInputForm";
import { CardList } from "../../components/CardList";
import { useState } from "react";
import { LayoutPanel } from "../../components/LayoutPanel";
import { Folder, useFolder } from "./useFolder";

const YouTubeList = ({ document }: { document: YouTubeDocument | undefined }) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
        {document &&
          Object.entries(document).map(([v, youTubeOEmbed], index) => (
            <Link
              key={`youtube-${index}`}
              href={`${youTubeUrl}${v}`}
              sx={{ width: mobile ? "100%" : "calc(25% - 1px)", backgroundColor: "#000000", textDecoration: "none" }}
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
          ))}
      </Stack>
    </Stack>
  );
};

const CardContent = ({ folder }: { folder: Folder }) => {
  return (
    <Stack sx={{ flexDirection: "row", gap: 2 }}>
      <Stack sx={{ flex: 1, p: 2, justifyContent: "center" }}>
        <Typography sx={{ fontSize: 16 }}>{folder.name}</Typography>
      </Stack>
    </Stack>
  );
};

export const YouTube = () => {
  const { folders, selectedFolder, setSelectedFolder, addFolder } = useFolder();
  const { document, add, exportUrls } = useYouTube(selectedFolder?.id);
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
            renderItem={(item) => <CardContent folder={item} />}
            onItemClick={(item) => {
              item && setSelectedFolder(item);
              setPanelOpened(false);
            }}
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
      topChildren={selectedFolder ? <CardContent folder={selectedFolder} /> : <></>}
    >
      <YouTubeList document={document} />
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
