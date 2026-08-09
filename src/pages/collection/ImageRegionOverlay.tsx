import {
  MouseEvent as ReactMouseEvent,
  RefObject,
  SyntheticEvent,
  TouchEvent as ReactTouchEvent,
  useEffect,
  useRef,
  useState
} from "react";
import { alpha, Box, Stack, useTheme } from "@mui/material";
import { TextRegion } from "../../services/Types";

export type { TextRegion };

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

type Interaction =
  | { type: "drag"; regionId: string; startMouseX: number; startMouseY: number; startX: number; startY: number }
  | {
      type: "resize";
      regionId: string;
      handle: Handle;
      startMouseX: number;
      startMouseY: number;
      startRegion: TextRegion;
    };

const HANDLE_SIZE = 12;
const MIN_SIZE = 20;
const HANDLES: Handle[] = ["nw", "ne", "se", "sw"];

const HANDLE_CURSORS: Record<Handle, string> = {
  nw: "nwse-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize"
};

const getHandlePosition = (region: TextRegion, handle: Handle) => {
  const { x, y, width, height } = region;
  const half = HANDLE_SIZE / 2;
  switch (handle) {
    case "nw":
      return { x: x - half, y: y - half };
    case "n":
      return { x: x + width / 2 - half, y: y - half };
    case "ne":
      return { x: x + width - half, y: y - half };
    case "e":
      return { x: x + width - half, y: y + height / 2 - half };
    case "se":
      return { x: x + width - half, y: y + height - half };
    case "s":
      return { x: x + width / 2 - half, y: y + height - half };
    case "sw":
      return { x: x - half, y: y + height - half };
    case "w":
      return { x: x - half, y: y + height / 2 - half };
  }
};

const applyResize = (startRegion: TextRegion, handle: Handle, dx: number, dy: number): TextRegion => {
  let { x, y, width, height } = startRegion;
  if (handle.includes("e")) {
    width = Math.max(MIN_SIZE, startRegion.width + dx);
  }
  if (handle.includes("s")) {
    height = Math.max(MIN_SIZE, startRegion.height + dy);
  }
  if (handle.includes("w")) {
    const newWidth = Math.max(MIN_SIZE, startRegion.width - dx);
    x = startRegion.x + startRegion.width - newWidth;
    width = newWidth;
  }
  if (handle.includes("n")) {
    const newHeight = Math.max(MIN_SIZE, startRegion.height - dy);
    y = startRegion.y + startRegion.height - newHeight;
    height = newHeight;
  }
  return { ...startRegion, x, y, width, height };
};

export const ImageRegionOverlay = ({
  src,
  alt,
  regions,
  onRegionsChange,
  onRegionMouseUp,
  scrollRef,
  fitScreen,
  fullScreen,
  selectedId,
  onSelectedIdChange,
  onImageLoad
}: {
  src: string;
  alt: string;
  regions: TextRegion[];
  onRegionsChange: (regions: TextRegion[]) => void;
  onRegionMouseUp?: (regionId: string) => void;
  scrollRef?: RefObject<HTMLDivElement | null>;
  fitScreen?: boolean;
  fullScreen?: boolean;
  selectedId?: string | null;
  onSelectedIdChange?: (id: string | null) => void;
  onImageLoad?: () => void;
}) => {
  const { palette, typography } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const interaction = useRef<Interaction | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }
    const onTouchMove = (e: TouchEvent) => {
      if (interaction.current) {
        e.preventDefault();
      }
    };
    svg.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      svg.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const getSvgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current!;
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const transformed = point.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: transformed.x, y: transformed.y };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!interaction.current) {
      return;
    }
    const { x, y } = getSvgPoint(clientX, clientY);
    if (interaction.current.type === "drag") {
      const { regionId, startMouseX, startMouseY, startX, startY } = interaction.current;
      const dx = x - startMouseX;
      const dy = y - startMouseY;
      onRegionsChange(
        regions.map((region) => (region.id === regionId ? { ...region, x: startX + dx, y: startY + dy } : region))
      );
    } else {
      const { regionId, handle, startMouseX, startMouseY, startRegion } = interaction.current;
      const dx = x - startMouseX;
      const dy = y - startMouseY;
      onRegionsChange(
        regions.map((region) => (region.id === regionId ? applyResize(startRegion, handle, dx, dy) : region))
      );
    }
  };

  const handleEnd = () => {
    if (interaction.current) {
      onRegionMouseUp?.(interaction.current.regionId);
    }
    interaction.current = null;
  };

  const onMouseMove = (event: ReactMouseEvent) => handleMove(event.clientX, event.clientY);
  const onTouchMove = (event: ReactTouchEvent) => handleMove(event.touches[0].clientX, event.touches[0].clientY);
  const onMouseUp = handleEnd;
  const onTouchEnd = handleEnd;

  const handleRegionPointerDown = (clientX: number, clientY: number, regionId: string) => {
    onSelectedIdChange?.(regionId);
    const { x, y } = getSvgPoint(clientX, clientY);
    const region = regions.find((r) => r.id === regionId)!;
    interaction.current = {
      type: "drag",
      regionId,
      startMouseX: x,
      startMouseY: y,
      startX: region.x,
      startY: region.y
    };
  };

  const onRegionMouseDown = (event: ReactMouseEvent, regionId: string) => {
    event.stopPropagation();
    handleRegionPointerDown(event.clientX, event.clientY, regionId);
  };

  const onRegionTouchStart = (event: ReactTouchEvent, regionId: string) => {
    event.stopPropagation();
    handleRegionPointerDown(event.touches[0].clientX, event.touches[0].clientY, regionId);
  };

  const handleHandlePointerDown = (clientX: number, clientY: number, regionId: string, handle: Handle) => {
    const { x, y } = getSvgPoint(clientX, clientY);
    const region = regions.find((r) => r.id === regionId)!;
    interaction.current = {
      type: "resize",
      regionId,
      handle,
      startMouseX: x,
      startMouseY: y,
      startRegion: { ...region }
    };
  };

  const onHandleMouseDown = (event: ReactMouseEvent, regionId: string, handle: Handle) => {
    event.stopPropagation();
    handleHandlePointerDown(event.clientX, event.clientY, regionId, handle);
  };

  const onHandleTouchStart = (event: ReactTouchEvent, regionId: string, handle: Handle) => {
    event.stopPropagation();
    handleHandlePointerDown(event.touches[0].clientX, event.touches[0].clientY, regionId, handle);
  };

  return (
    <Stack
      ref={scrollRef}
      sx={
        fitScreen
          ? {
              height: "100%",
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "common.black"
            }
          : { height: "100%", overflow: "auto", alignItems: "flex-start", backgroundColor: "common.black" }
      }
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
          sx={{ display: "block", ...(fitScreen && { maxWidth: "100%", maxHeight: fullScreen ? "100%" : "80dvh" }) }}
          onLoad={(e: SyntheticEvent<HTMLImageElement>) => {
            setNaturalSize({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight });
            onImageLoad?.();
          }}
        />
        <Box
          component="svg"
          ref={svgRef}
          {...(fitScreen && naturalSize.width > 0 && { viewBox: `0 0 ${naturalSize.width} ${naturalSize.height}` })}
          sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible" }}
          onMouseDown={() => onSelectedIdChange?.(null)}
          onTouchStart={() => onSelectedIdChange?.(null)}
          onMouseMove={onMouseMove}
          onTouchMove={onTouchMove}
          onMouseUp={onMouseUp}
          onTouchEnd={onTouchEnd}
          onMouseLeave={onMouseUp}
        >
          {regions.map((region, i) => {
            const isSelected = region.id === selectedId;
            const avatarRadius = 16;
            const avatarCx = region.x - 24;
            const avatarCy = region.y + 16;
            return (
              <g key={region.id}>
                <circle
                  cx={avatarCx}
                  cy={avatarCy}
                  r={avatarRadius}
                  fill={isSelected ? palette.common.black : palette.primary.main}
                  style={{ pointerEvents: "none" }}
                />
                <text
                  x={avatarCx}
                  y={avatarCy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isSelected ? palette.common.white : palette.primary.contrastText}
                  fontSize={12}
                  style={{ userSelect: "none", pointerEvents: "none", fontFamily: typography.fontFamily }}
                >
                  {i + 1}
                </text>
                <rect
                  x={region.x}
                  y={region.y}
                  width={region.width}
                  height={region.height}
                  fill={alpha(palette.primary.main, 0.4)}
                  stroke={palette.primary.main}
                  strokeWidth={1}
                  style={{ cursor: "move" }}
                  onMouseDown={(e) => onRegionMouseDown(e, region.id)}
                  onTouchStart={(e) => onRegionTouchStart(e, region.id)}
                />
                {isSelected &&
                  HANDLES.map((handle) => {
                    const pos = getHandlePosition(region, handle);
                    return (
                      <rect
                        key={handle}
                        x={pos.x}
                        y={pos.y}
                        width={HANDLE_SIZE}
                        height={HANDLE_SIZE}
                        fill={palette.primary.main}
                        style={{ cursor: HANDLE_CURSORS[handle] }}
                        onMouseDown={(e) => onHandleMouseDown(e, region.id, handle)}
                        onTouchStart={(e) => onHandleTouchStart(e, region.id, handle)}
                      />
                    );
                  })}
              </g>
            );
          })}
        </Box>
      </Box>
    </Stack>
  );
};
