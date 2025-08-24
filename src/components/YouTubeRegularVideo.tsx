import { Box, Link, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { WButton } from "./WButton";
import { regularUrl } from "../common/YouTube";
import { YouTubeOEmbed } from "../common/Bookmark";
import CrossWhiteIcon from "../assets/images/icons/cross-white.png";

export const YouTubeRegularVideo = ({
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
    <Stack sx={{ position: "relative", width: mobile ? "100%" : "calc(25% - 1px)" }}>
      <WButton
        onClick={onDeleteButtonClick}
        sx={{ position: "absolute", top: 0, right: 0, width: 48, height: 48, backgroundColor: "black" }}
      >
        <Box component="img" src={CrossWhiteIcon} alt="" sx={{ width: "16px", height: "16px" }} />
      </WButton>
      <Link href={`${regularUrl}${id}`} sx={{ flex: 1, backgroundColor: "#000000", textDecoration: "none" }}>
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
  );
};
