import { Box, Link, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useYouTube, YouTubeDocument } from "./useYouTube";
import { TextInputForm } from "../../components/TextInputForm";

const YouTubeList = ({ document }: { document: YouTubeDocument | undefined }) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const youTubeUrl = "https://www.youtube.com/watch?v=";
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px" }}>
        {document &&
          Object.entries(document).map(([v, youTubeOembed], index) => (
            <Link
              key={`youtube-${index}`}
              href={`${youTubeUrl}${v}`}
              sx={{ width: mobile ? "100%" : "calc(25% - 1px)", backgroundColor: "#000000", textDecoration: "none" }}
            >
              <Stack sx={{ aspectRatio: "16/9" }}>
                <Box
                  component="img"
                  src={youTubeOembed.thumbnail_url}
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
                  {youTubeOembed.title}
                </Typography>
              </Stack>
            </Link>
          ))}
      </Stack>
    </Stack>
  );
};

export const YouTube = () => {
  const { document, add } = useYouTube();
  return (
    <Stack sx={{ height: "100%" }}>
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
            onClick: () => {
              console.log("export");
            }
          }
        ]}
      />
    </Stack>
  );
};
