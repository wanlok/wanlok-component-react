import { ReactNode, Ref, TouchEvent as ReactTouchEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Box, Stack, SxProps, Theme, useMediaQuery, useTheme } from "@mui/material";

export interface ZoomPanImageHandle {
  element: HTMLDivElement | null;
  naturalSize: { width: number; height: number } | null;
  mobile: boolean;
  scale: number;
  position: { x: number; y: number };
  setScale: (scale: number) => void;
  setPosition: (position: { x: number; y: number }, scaleOverride?: number) => void;
}

export const getBaseSize = (
  containerWidth: number,
  containerHeight: number,
  naturalSize: { width: number; height: number }
) => {
  const containerAspect = containerWidth / containerHeight;
  const imageAspect = naturalSize.width / naturalSize.height;
  return imageAspect > containerAspect
    ? { baseWidth: containerWidth, baseHeight: containerWidth / imageAspect }
    : { baseWidth: containerHeight * imageAspect, baseHeight: containerHeight };
};

export const ZoomPanImage = ({
  src,
  alt,
  scale: requestedScale,
  sx,
  children,
  onNaturalSizeChange,
  ref
}: {
  src: string;
  alt: string;
  scale?: number;
  sx?: SxProps<Theme>;
  children?: ReactNode;
  onNaturalSizeChange?: (size: { width: number; height: number }) => void;
  ref?: Ref<ZoomPanImageHandle>;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [appliedRequestedScale, setAppliedRequestedScale] = useState(requestedScale);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);

  if (requestedScale !== undefined && requestedScale !== appliedRequestedScale) {
    setAppliedRequestedScale(requestedScale);
    setScale(Math.min(Math.max(requestedScale, 1), 32));
    setPosition({ x: 0, y: 0 });
  }

  const lastDistance = useRef<number | null>(null);
  const lastMidpoint = useRef<{ x: number; y: number } | null>(null);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }
    const updateContainerSize = () => {
      setContainerSize({ width: element.clientWidth, height: element.clientHeight });
    };
    updateContainerSize();
    const resizeObserver = new ResizeObserver(updateContainerSize);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  const getDistance = (touches: ReactTouchEvent["touches"]) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getMidpoint = (touches: ReactTouchEvent["touches"]) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return null;
    }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2 - (rect.left + rect.width / 2),
      y: (touches[0].clientY + touches[1].clientY) / 2 - (rect.top + rect.height / 2)
    };
  };

  const getMaxOffset = (scaleToApply: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !naturalSize) {
      return { maxX: 0, maxY: 0 };
    }

    const { baseWidth, baseHeight } = getBaseSize(rect.width, rect.height, naturalSize);

    return {
      maxX: Math.max(0, (baseWidth * scaleToApply - rect.width) / 2),
      maxY: Math.max(0, (baseHeight * scaleToApply - rect.height) / 2)
    };
  };

  const clampPositionForScale = (candidate: { x: number; y: number }, scaleToApply: number) => {
    const { maxX, maxY } = getMaxOffset(scaleToApply);
    return {
      x: Math.min(maxX, Math.max(-maxX, candidate.x)),
      y: Math.min(maxY, Math.max(-maxY, candidate.y))
    };
  };

  useImperativeHandle(ref, () => ({
    element: containerRef.current,
    naturalSize,
    mobile,
    scale,
    position,
    setScale: (newScale) => setScale(Math.min(Math.max(newScale, 1), 32)),
    setPosition: (newPosition, scaleOverride) => setPosition(clampPositionForScale(newPosition, scaleOverride ?? scale))
  }));

  const onTouchStart = (e: ReactTouchEvent) => {
    if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches);
      lastMidpoint.current = getMidpoint(e.touches);
    } else if (e.touches.length === 1) {
      lastPosition.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      };
    }
  };

  const onTouchMove = (e: ReactTouchEvent) => {
    if (e.touches.length === 2 && lastDistance.current !== null && lastMidpoint.current !== null) {
      // Pinch to zoom (anchored to the last midpoint) combined with two-finger pan (midpoint translation)
      const newDistance = getDistance(e.touches);
      const delta = newDistance / lastDistance.current;
      const oldScale = scale;
      const newScale = Math.min(Math.max(oldScale * delta, 1), 32);

      const newMidpoint = getMidpoint(e.touches);
      if (newMidpoint) {
        setPosition(
          clampPositionForScale(
            {
              x: newMidpoint.x - (newScale / oldScale) * (lastMidpoint.current.x - position.x),
              y: newMidpoint.y - (newScale / oldScale) * (lastMidpoint.current.y - position.y)
            },
            newScale
          )
        );
        lastMidpoint.current = newMidpoint;
      }

      setScale(newScale);
      lastDistance.current = newDistance;
    } else if (e.touches.length === 1 && lastPosition.current !== null) {
      // Single finger pan
      setPosition(
        clampPositionForScale(
          {
            x: e.touches[0].clientX - lastPosition.current.x,
            y: e.touches[0].clientY - lastPosition.current.y
          },
          scale
        )
      );
    }
  };

  const onTouchEnd = () => {
    lastDistance.current = null;
    lastMidpoint.current = null;
    lastPosition.current = null;
  };

  const onLoad = (e: { currentTarget: HTMLImageElement }) => {
    const size = { width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight };
    setNaturalSize(size);
    onNaturalSizeChange?.(size);
  };

  if (!mobile) {
    // Desktop: real (non-transform) sizing so native scrollbars can pan the zoomed image.
    const { baseWidth, baseHeight } =
      containerSize && naturalSize
        ? getBaseSize(containerSize.width, containerSize.height, naturalSize)
        : { baseWidth: 0, baseHeight: 0 };

    return (
      <Stack
        ref={containerRef}
        sx={[
          {
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: "auto",
            alignItems: "safe center",
            justifyContent: "safe center"
          },
          ...(Array.isArray(sx) ? sx : [sx])
        ]}
      >
        <Box
          sx={{
            position: "relative",
            flexShrink: 0,
            width: baseWidth ? baseWidth * scale : "100%",
            height: baseHeight ? baseHeight * scale : "100%"
          }}
        >
          <Box
            component="img"
            src={src}
            alt={alt}
            onLoad={onLoad}
            sx={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
          />
          {children}
        </Box>
      </Stack>
    );
  }

  return (
    <Stack
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      sx={[
        {
          flex: 1,
          minHeight: 0,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          touchAction: "none"
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
        }}
      >
        <Box
          component="img"
          src={src}
          alt={alt}
          onLoad={onLoad}
          sx={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
        />
        {children}
      </Box>
    </Stack>
  );
};
