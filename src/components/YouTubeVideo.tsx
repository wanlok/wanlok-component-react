import { Box, Link, Stack, Typography } from "@mui/material";
import { WButton } from "./WButton";
import { regularUrl } from "../common/YouTube";
import { YouTubeOEmbed } from "../common/Bookmark";
import CrossWhiteIcon from "../assets/images/icons/cross-white.png";

export const YouTubeVideo = ({
  id,
  youTubeOEmbed,
  width,
  aspectRatio,
  onDeleteButtonClick
}: {
  id: string;
  youTubeOEmbed: YouTubeOEmbed;
  width: string;
  aspectRatio: string;
  onDeleteButtonClick: () => void;
}) => {
  return (
    <Stack sx={{ position: "relative", width }}>
      <WButton
        onClick={onDeleteButtonClick}
        sx={{ position: "absolute", top: 0, right: 0, width: 48, height: 48, backgroundColor: "black" }}
      >
        <Box component="img" src={CrossWhiteIcon} alt="" sx={{ width: "16px", height: "16px" }} />
      </WButton>
      <Link href={`${regularUrl}${id}`} sx={{ flex: 1, backgroundColor: "#000000", textDecoration: "none" }}>
        <Stack sx={{ aspectRatio }}>
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
