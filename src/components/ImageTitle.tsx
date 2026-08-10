import { ReactNode } from "react";
import { Box, ButtonBase, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ControlGroup } from "./ControlGroup";
import { OneLineTypography } from "./OneLineTypography";
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
  height,
  bottomChildren,
  rightChildren
}: {
  imageUrl: string;
  imageSx?: SxProps<Theme>;
  name?: string;
  aspectRatio?: string;
  height?: string;
  bottomChildren?: ReactNode;
  rightChildren?: ReactNode;
}) => {
  const typographySx: SxProps<Theme> = {
    color: "common.white",
    wordBreak: name && name.indexOf(" ") > 0 ? undefined : "break-all"
  };
  return (
    <>
      <Stack sx={{ aspectRatio, height, position: "relative" }}>
        <Box
          component="img"
          src={imageUrl}
          alt=""
          sx={{ display: "block", objectFit: "cover", width: "100%", height: "100%", ...imageSx }}
        />
      </Stack>
      <Stack sx={{ flexDirection: "row", px: 2, gap: 2, height: 80 }}>
        <Stack sx={{ flex: 1, gap: 0.5, justifyContent: "center" }}>
          {name &&
            (bottomChildren ? (
              <OneLineTypography variant="body1" sx={typographySx}>
                {name}
              </OneLineTypography>
            ) : (
              <Typography
                variant="body1"
                sx={[
                  {
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    textOverflow: "ellipsis"
                  },
                  typographySx
                ]}
              >
                {name}
              </Typography>
            ))}
          {bottomChildren}
        </Stack>
        {rightChildren}
      </Stack>
    </>
  );
};

export const ImageTitle = ({
  imageUrl,
  imageSx,
  name,
  href,
  onClick,
  height,
  aspectRatio,
  bottomChildren,
  rightChildren,
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
  bottomChildren?: ReactNode;
  rightChildren?: ReactNode;
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
            bottomChildren={bottomChildren}
            rightChildren={rightChildren}
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
            bottomChildren={bottomChildren}
            rightChildren={rightChildren}
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
