import { Box, Link, Stack, Typography } from "@mui/material";
import { WButton } from "./WButton";
import CrossWhiteIcon from "../assets/images/icons/cross-white.png";

export const ImageTitleLink = ({
  title,
  imageUrl,
  href,
  width,
  aspectRatio,
  onDeleteButtonClick
}: {
  title: string;
  imageUrl: string;
  href: string;
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
      <Link href={href} sx={{ flex: 1, backgroundColor: "#000000", textDecoration: "none" }}>
        <Stack sx={{ aspectRatio }}>
          <Box
            component="img"
            src={imageUrl}
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
            {title}
          </Typography>
        </Stack>
      </Link>
    </Stack>
  );
};
