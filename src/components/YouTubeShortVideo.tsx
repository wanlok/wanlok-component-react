import { Box, Link, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { YouTubeOEmbed } from "../common/Bookmark";

export const YouTubeShortVideo = ({
  id,
  youTubeOEmbed,
  onDeleteButtonClick
}: {
  id: string;
  youTubeOEmbed: YouTubeOEmbed;
  onDeleteButtonClick: () => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return (
    <Stack sx={{ position: "relative", width: mobile ? "100%" : "200px", whiteSpace: "nowrap" }}>
      <Link href={``} sx={{ flex: 1, backgroundColor: "#000000", textDecoration: "none" }}>
        <Stack sx={{ aspectRatio: "9/16" }}>
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
  );
};
