import { TouchEvent as ReactTouchEvent, useRef, useState } from "react";
import { Box, Stack, SxProps, Theme } from "@mui/material";

export const PinchZoomImage = ({ src, alt, sx }: { src: string; alt: string; sx?: SxProps<Theme> }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastDistance = useRef<number | null>(null);
  const lastMidpoint = useRef<{ x: number; y: number } | null>(null);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const naturalSize = useRef<{ width: number; height: number } | null>(null);

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
    if (!rect || !naturalSize.current) {
      return { maxX: 0, maxY: 0 };
    }

    const containerAspect = rect.width / rect.height;
    const imageAspect = naturalSize.current.width / naturalSize.current.height;
    const baseWidth = imageAspect > containerAspect ? rect.width : rect.height * imageAspect;
    const baseHeight = imageAspect > containerAspect ? rect.width / imageAspect : rect.height;

    return {
      maxX: Math.max(0, (baseWidth * scaleToApply - rect.width) / 2),
      maxY: Math.max(0, (baseHeight * scaleToApply - rect.height) / 2)
    };
  };

  const clampPosition = (candidate: { x: number; y: number }, scaleToApply: number) => {
    const { maxX, maxY } = getMaxOffset(scaleToApply);
    return {
      x: Math.min(maxX, Math.max(-maxX, candidate.x)),
      y: Math.min(maxY, Math.max(-maxY, candidate.y))
    };
  };

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
    e.preventDefault();

    if (e.touches.length === 2 && lastDistance.current !== null && lastMidpoint.current !== null) {
      // Pinch to zoom (anchored to the last midpoint) combined with two-finger pan (midpoint translation)
      const newDistance = getDistance(e.touches);
      const delta = newDistance / lastDistance.current;
      const oldScale = scale;
      const newScale = Math.min(Math.max(oldScale * delta, 1), 32);

      const newMidpoint = getMidpoint(e.touches);
      if (newMidpoint) {
        setPosition(
          clampPosition(
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
        clampPosition(
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
        component="img"
        src={src}
        alt={alt}
        onLoad={(e) => {
          naturalSize.current = { width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight };
        }}
        sx={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
        }}
      />
    </Stack>
  );
};
