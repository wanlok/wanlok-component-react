import { Box, Link, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ControlGroup } from "./ControlGroup";
import { Direction } from "../services/Types";
import { useEffect, useState } from "react";

export const ImageTitleLink = ({
  imageUrl,
  imageFallbackUrl,
  imageSx,
  name,
  href,
  width,
  height,
  aspectRatio,
  leftMost = false,
  rightMost = false,
  scrollHorizontally,
  controlGroupState,
  onDetailsButtonClick,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  imageUrl: string;
  imageFallbackUrl?: string;
  imageSx?: SxProps<Theme>;
  name?: string;
  href: string;
  width: string | Record<string, string>;
  height?: string;
  aspectRatio?: string;
  leftMost?: boolean;
  rightMost?: boolean;
  scrollHorizontally: boolean;
  controlGroupState: number;
  onDetailsButtonClick: () => void;
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
        {name && (
          <Stack sx={{ p: 2 }}>
            <Typography
              variant="body1"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "common.white",
                wordBreak: name.indexOf(" ") > 0 ? undefined : "break-all"
              }}
            >
              {name}
            </Typography>
          </Stack>
        )}
      </Link>
      {controlGroupState === 1 && (
        <ControlGroup
          direction={Direction.right}
          scrollHorizontally={scrollHorizontally}
          onDetailsButtonClick={onDetailsButtonClick}
        />
      )}
      {controlGroupState === 2 && (
        <ControlGroup
          direction={Direction.right}
          scrollHorizontally={scrollHorizontally}
          onDeleteButtonClick={onDeleteButtonClick}
        />
      )}
      {controlGroupState === 3 && (
        <ControlGroup
          direction={Direction.right}
          scrollHorizontally={scrollHorizontally}
          onLeftButtonClick={leftMost ? undefined : onLeftButtonClick}
          onRightButtonClick={rightMost ? undefined : onRightButtonClick}
        />
      )}
    </Stack>
  );
};
