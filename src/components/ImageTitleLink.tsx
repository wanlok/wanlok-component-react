import { Box, Link, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ControlGroup } from "./ControlGroup";
import { Direction } from "../services/Types";

export const ImageTitleLink = ({
  imageUrl,
  imageSx,
  name,
  href,
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
  imageSx?: SxProps<Theme>;
  name?: string;
  href: string;
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
  return (
    <Stack sx={{ position: "relative" }}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ flex: 1, backgroundColor: "common.black", textDecoration: "none" }}
      >
        <Stack sx={{ aspectRatio, height }}>
          <Box
            component="img"
            src={imageUrl}
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
      {controlGroupState === 3 && (
        <ControlGroup
          direction={Direction.right}
          scrollHorizontally={scrollHorizontally}
          onDeleteButtonClick={onDeleteButtonClick}
        />
      )}
      {controlGroupState === 2 && (
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
