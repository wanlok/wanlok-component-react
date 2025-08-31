import { Box, Link, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ControlGroup } from "./ControlGroup";
import { Direction } from "../services/Types";
import { useEffect, useState } from "react";

export const ImageTitleLink = ({
  imageUrl,
  imageFallbackUrl,
  imageSx,
  title,
  href,
  width,
  height,
  aspectRatio,
  leftMost = false,
  rightMost = false,
  scrollHorizontally = false,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  imageUrl: string;
  imageFallbackUrl?: string;
  imageSx?: SxProps<Theme>;
  title?: string;
  href: string;
  width: string;
  height?: string;
  aspectRatio?: string;
  leftMost?: boolean;
  rightMost?: boolean;
  scrollHorizontally?: boolean;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    setSrc(imageUrl);
  }, [imageUrl]);

  return (
    <Stack sx={{ position: "relative", width }}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ flex: 1, backgroundColor: "common.black", textDecoration: "none" }}
      >
        <Stack sx={{ aspectRatio, height }}>
          <Box
            component="img"
            src={src}
            onError={() => {
              if (imageFallbackUrl) {
                setSrc(imageFallbackUrl);
              }
            }}
            alt=""
            sx={{
              display: "block",
              objectFit: "cover",
              width: "100%",
              height: "100%",
              ...imageSx
            }}
          />
        </Stack>
        {title && (
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
                fontSize: 16,
                wordBreak: title.indexOf(" ") > 0 ? undefined : "break-all"
              }}
            >
              {title}
            </Typography>
          </Stack>
        )}
      </Link>
      <ControlGroup
        direction={Direction.left}
        scrollHorizontally={scrollHorizontally}
        onDeleteButtonClick={onDeleteButtonClick}
      />
      <ControlGroup
        direction={Direction.right}
        scrollHorizontally={scrollHorizontally}
        onLeftButtonClick={leftMost ? undefined : onLeftButtonClick}
        onRightButtonClick={rightMost ? undefined : onRightButtonClick}
      />
    </Stack>
  );
};
