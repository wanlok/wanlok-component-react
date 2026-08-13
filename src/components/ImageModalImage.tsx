import { ReactNode, RefObject, SyntheticEvent } from "react";
import { Box, Stack } from "@mui/material";

export const ImageModalImage = ({
  src,
  alt,
  fitScreen,
  fullScreen,
  scrollRef,
  onImageLoad,
  children
}: {
  src: string;
  alt: string;
  fitScreen?: boolean;
  fullScreen?: boolean;
  scrollRef?: RefObject<HTMLDivElement | null>;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  children?: ReactNode;
}) => (
  <Stack
    ref={scrollRef}
    sx={{
      height: "100%",
      backgroundColor: "common.black",
      userSelect: "none",
      ...(fitScreen
        ? { alignItems: "center", justifyContent: "center" }
        : { overflow: "auto", alignItems: "flex-start" })
    }}
  >
    <Box
      sx={{
        position: "relative",
        lineHeight: 0,
        m: "auto",
        ...(fitScreen && fullScreen
          ? { display: "flex", height: "100%", maxWidth: "100%", alignItems: "center", justifyContent: "center" }
          : { display: "inline-block", ...(fitScreen && { maxWidth: "100%" }) })
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        onLoad={onImageLoad}
        sx={{ display: "block", ...(fitScreen && { maxWidth: "100%", maxHeight: fullScreen ? "100%" : "80dvh" }) }}
      />
      {children}
    </Box>
  </Stack>
);
