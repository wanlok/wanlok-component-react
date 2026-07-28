import { Box, ButtonBase, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ControlGroup } from "./ControlGroup";
import { Direction } from "../services/Types";

const imageTitleSx = {
  flex: 1,
  display: "block",
  width: "100%",
  textAlign: "left",
  backgroundColor: "common.black",
  textDecoration: "none"
};

const ImageTitleContent = ({
  imageUrl,
  imageSx,
  name,
  aspectRatio,
  height
}: {
  imageUrl: string;
  imageSx?: SxProps<Theme>;
  name?: string;
  aspectRatio?: string;
  height?: string;
}) => (
  <>
    <Stack sx={{ aspectRatio, height }}>
      <Box
        component="img"
        src={imageUrl}
        alt=""
        sx={{ display: "block", objectFit: "cover", width: "100%", height: "100%", ...imageSx }}
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
  </>
);

export const ImageTitleLink = ({
  imageUrl,
  imageSx,
  name,
  href,
  onClick,
  height,
  aspectRatio,
  leftMost = false,
  rightMost = false,
  scrollHorizontally,
  controlGroupState,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  imageUrl: string;
  imageSx?: SxProps<Theme>;
  name?: string;
  href?: string;
  onClick?: () => void;
  height?: string;
  aspectRatio?: string;
  leftMost?: boolean;
  rightMost?: boolean;
  scrollHorizontally: boolean;
  controlGroupState: number;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  return (
    <Stack sx={{ position: "relative" }}>
      {onClick ? (
        <ButtonBase onClick={onClick} sx={imageTitleSx}>
          <ImageTitleContent
            imageUrl={imageUrl}
            imageSx={imageSx}
            name={name}
            aspectRatio={aspectRatio}
            height={height}
          />
        </ButtonBase>
      ) : (
        <ButtonBase component="a" href={href} target="_blank" rel="noopener noreferrer" sx={imageTitleSx}>
          <ImageTitleContent
            imageUrl={imageUrl}
            imageSx={imageSx}
            name={name}
            aspectRatio={aspectRatio}
            height={height}
          />
        </ButtonBase>
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
