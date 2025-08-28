import { Box, Link, Stack, Typography } from "@mui/material";
import { ControlGroup } from "./ControlGroup";

export const ImageTitleLink = ({
  title,
  imageUrl,
  href,
  width,
  aspectRatio,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  title: string;
  imageUrl: string;
  href: string;
  width: string;
  aspectRatio: string;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  return (
    <Stack sx={{ position: "relative", width }}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ flex: 1, backgroundColor: "common.black", textDecoration: "none" }}
      >
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
              color: "common.white",
              fontSize: 16
            }}
          >
            {title}
          </Typography>
        </Stack>
      </Link>
      <ControlGroup
        onLeftButtonClick={onLeftButtonClick}
        onRightButtonClick={onRightButtonClick}
        onDeleteButtonClick={onDeleteButtonClick}
      />
    </Stack>
  );
};
