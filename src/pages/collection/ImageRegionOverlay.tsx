import {
  MouseEvent as ReactMouseEvent,
  RefObject,
  SyntheticEvent,
  TouchEvent as ReactTouchEvent,
  useEffect,
  useRef,
  useState
} from "react";
import { alpha, Box, useTheme } from "@mui/material";
import { Region, RegionPoint, Rect } from "../../services/Types";
import { getPointsBoundingBox, getRectPoints } from "../../common/ImageUtils";
import { ImageModalImage } from "../../components/ImageModalImage";

export type { Region };

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

type Interaction =
  | { type: "drag"; index: number; startMouseX: number; startMouseY: number; startPoints: RegionPoint[] }
  | { type: "resize"; index: number; handle: Handle; startMouseX: number; startMouseY: number; startRect: Rect }
  | { type: "movePoint"; index: number; pointIndex: number };

const HANDLE_SIZE = 12;
const MIN_SIZE = 20;
const MIN_POLYGON_POINTS = 3;
const DOUBLE_TAP_MS = 300;
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

const getHandlePosition = (rect: Rect, handle: Handle) => {
  const { x, y, width, height } = rect;
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

const applyResize = (startRect: Rect, handle: Handle, dx: number, dy: number): Rect => {
  let { x, y, width, height } = startRect;
  if (handle.includes("e")) {
    width = Math.max(MIN_SIZE, startRect.width + dx);
  }
  if (handle.includes("s")) {
    height = Math.max(MIN_SIZE, startRect.height + dy);
  }
  if (handle.includes("w")) {
    const newWidth = Math.max(MIN_SIZE, startRect.width - dx);
    x = startRect.x + startRect.width - newWidth;
    width = newWidth;
  }
  if (handle.includes("n")) {
    const newHeight = Math.max(MIN_SIZE, startRect.height - dy);
    y = startRect.y + startRect.height - newHeight;
    height = newHeight;
  }
  return { x, y, width, height };
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
  selectedIndex,
  onSelectedIndexChange,
  isPolygonEnabled,
  onImageLoad
}: {
  src: string;
  alt: string;
  regions: Region[];
  onRegionsChange: (regions: Region[]) => void;
  onRegionMouseUp?: (index: number) => void;
  scrollRef?: RefObject<HTMLDivElement | null>;
  fitScreen?: boolean;
  fullScreen?: boolean;
  selectedIndex?: number | null;
  onSelectedIndexChange?: (index: number | null) => void;
  isPolygonEnabled?: boolean;
  onImageLoad?: (naturalSize: { width: number; height: number }) => void;
}) => {
  const { palette, typography } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const interaction = useRef<Interaction | null>(null);
  const lastTap = useRef<{ index: number; pointIndex: number; time: number } | null>(null);
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
      const { index, startMouseX, startMouseY, startPoints } = interaction.current;
      const dx = x - startMouseX;
      const dy = y - startMouseY;
      onRegionsChange(
        regions.map((region, i) =>
          i === index ? { ...region, points: startPoints.map((p) => ({ x: p.x + dx, y: p.y + dy })) } : region
        )
      );
    } else if (interaction.current.type === "resize") {
      const { index, handle, startMouseX, startMouseY, startRect } = interaction.current;
      const dx = x - startMouseX;
      const dy = y - startMouseY;
      onRegionsChange(
        regions.map((region, i) =>
          i === index ? { ...region, points: getRectPoints(applyResize(startRect, handle, dx, dy)) } : region
        )
      );
    } else {
      const { index, pointIndex } = interaction.current;
      onRegionsChange(
        regions.map((region, i) =>
          i === index ? { ...region, points: region.points.map((p, j) => (j === pointIndex ? { x, y } : p)) } : region
        )
      );
    }
  };

  const handleEnd = () => {
    if (interaction.current) {
      onRegionMouseUp?.(interaction.current.index);
    }
    interaction.current = null;
  };

  const onMouseMove = (event: ReactMouseEvent) => handleMove(event.clientX, event.clientY);
  const onTouchMove = (event: ReactTouchEvent) => handleMove(event.touches[0].clientX, event.touches[0].clientY);
  const onMouseUp = handleEnd;
  const onTouchEnd = handleEnd;

  const handleRegionPointerDown = (clientX: number, clientY: number, index: number) => {
    onSelectedIndexChange?.(index);
    const { x, y } = getSvgPoint(clientX, clientY);
    interaction.current = {
      type: "drag",
      index,
      startMouseX: x,
      startMouseY: y,
      startPoints: regions[index].points.map((p) => ({ ...p }))
    };
  };

  const onRegionMouseDown = (event: ReactMouseEvent, index: number) => {
    event.stopPropagation();
    handleRegionPointerDown(event.clientX, event.clientY, index);
  };

  const onRegionTouchStart = (event: ReactTouchEvent, index: number) => {
    event.stopPropagation();
    handleRegionPointerDown(event.touches[0].clientX, event.touches[0].clientY, index);
  };

  const handleHandlePointerDown = (clientX: number, clientY: number, index: number, handle: Handle) => {
    const { x, y } = getSvgPoint(clientX, clientY);
    const rect = getPointsBoundingBox(regions[index].points);
    interaction.current = {
      type: "resize",
      index,
      handle,
      startMouseX: x,
      startMouseY: y,
      startRect: rect
    };
  };

  const onHandleMouseDown = (event: ReactMouseEvent, index: number, handle: Handle) => {
    event.stopPropagation();
    handleHandlePointerDown(event.clientX, event.clientY, index, handle);
  };

  const onHandleTouchStart = (event: ReactTouchEvent, index: number, handle: Handle) => {
    event.stopPropagation();
    handleHandlePointerDown(event.touches[0].clientX, event.touches[0].clientY, index, handle);
  };

  const removeVertex = (index: number, pointIndex: number) => {
    onRegionsChange(
      regions.map((region, i) => {
        if (i !== index || region.points.length <= MIN_POLYGON_POINTS) {
          return region;
        }
        return { ...region, points: region.points.filter((_, j) => j !== pointIndex) };
      })
    );
  };

  const onVertexMouseDown = (event: ReactMouseEvent, index: number, pointIndex: number) => {
    event.stopPropagation();
    interaction.current = { type: "movePoint", index, pointIndex };
  };

  const onVertexTouchStart = (event: ReactTouchEvent, index: number, pointIndex: number) => {
    event.stopPropagation();
    const now = event.timeStamp;
    const last = lastTap.current;
    if (last && last.index === index && last.pointIndex === pointIndex && now - last.time < DOUBLE_TAP_MS) {
      lastTap.current = null;
      removeVertex(index, pointIndex);
      return;
    }
    lastTap.current = { index, pointIndex, time: now };
    interaction.current = { type: "movePoint", index, pointIndex };
  };

  const onVertexDoubleClick = (event: ReactMouseEvent, index: number, pointIndex: number) => {
    event.stopPropagation();
    removeVertex(index, pointIndex);
  };

  const handleMidpointPointerDown = (index: number, edgeIndex: number, midpoint: RegionPoint) => {
    const newPointIndex = edgeIndex + 1;
    onRegionsChange(
      regions.map((region, i) => {
        if (i !== index) {
          return region;
        }
        const points = [...region.points];
        points.splice(newPointIndex, 0, midpoint);
        return { ...region, points };
      })
    );
    interaction.current = { type: "movePoint", index, pointIndex: newPointIndex };
  };

  const onMidpointMouseDown = (event: ReactMouseEvent, index: number, edgeIndex: number, midpoint: RegionPoint) => {
    event.stopPropagation();
    handleMidpointPointerDown(index, edgeIndex, midpoint);
  };

  const onMidpointTouchStart = (event: ReactTouchEvent, index: number, edgeIndex: number, midpoint: RegionPoint) => {
    event.stopPropagation();
    handleMidpointPointerDown(index, edgeIndex, midpoint);
  };

  return (
    <ImageModalImage
      src={src}
      alt={alt}
      fitScreen={fitScreen}
      fullScreen={fullScreen}
      scrollRef={scrollRef}
      onImageLoad={(e: SyntheticEvent<HTMLImageElement>) => {
        const size = { width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight };
        setNaturalSize(size);
        onImageLoad?.(size);
      }}
    >
      <Box
        component="svg"
        ref={svgRef}
        {...(fitScreen && naturalSize.width > 0 && { viewBox: `0 0 ${naturalSize.width} ${naturalSize.height}` })}
        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible" }}
        onMouseDown={() => onSelectedIndexChange?.(null)}
        onTouchStart={() => onSelectedIndexChange?.(null)}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        onMouseLeave={onMouseUp}
      >
        {regions.map((region, i) => {
          const rect = getPointsBoundingBox(region.points);
          const isSelected = i === selectedIndex;
          const avatarRadius = 16;
          const avatarCx = rect.x - 24;
          const avatarCy = rect.y + 16;
          return (
            <g key={i}>
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
              {isPolygonEnabled ? (
                <polygon
                  points={region.points.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill={alpha(palette.primary.main, 0.4)}
                  stroke={palette.primary.main}
                  strokeWidth={1}
                  style={{ cursor: "move" }}
                  onMouseDown={(e) => onRegionMouseDown(e, i)}
                  onTouchStart={(e) => onRegionTouchStart(e, i)}
                />
              ) : (
                <rect
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill={alpha(palette.primary.main, 0.4)}
                  stroke={palette.primary.main}
                  strokeWidth={1}
                  style={{ cursor: "move" }}
                  onMouseDown={(e) => onRegionMouseDown(e, i)}
                  onTouchStart={(e) => onRegionTouchStart(e, i)}
                />
              )}
              {isSelected &&
                !isPolygonEnabled &&
                HANDLES.map((handle) => {
                  const pos = getHandlePosition(rect, handle);
                  return (
                    <rect
                      key={handle}
                      x={pos.x}
                      y={pos.y}
                      width={HANDLE_SIZE}
                      height={HANDLE_SIZE}
                      fill={palette.primary.main}
                      style={{ cursor: HANDLE_CURSORS[handle] }}
                      onMouseDown={(e) => onHandleMouseDown(e, i, handle)}
                      onTouchStart={(e) => onHandleTouchStart(e, i, handle)}
                    />
                  );
                })}
              {isSelected && isPolygonEnabled && (
                <>
                  {region.points.map((point, edgeIndex) => {
                    const next = region.points[(edgeIndex + 1) % region.points.length];
                    const midpoint = { x: (point.x + next.x) / 2, y: (point.y + next.y) / 2 };
                    return (
                      <circle
                        key={`midpoint-${edgeIndex}`}
                        cx={midpoint.x}
                        cy={midpoint.y}
                        r={6}
                        fill={palette.primary.main}
                        style={{ cursor: "copy" }}
                        onMouseDown={(e) => onMidpointMouseDown(e, i, edgeIndex, midpoint)}
                        onTouchStart={(e) => onMidpointTouchStart(e, i, edgeIndex, midpoint)}
                      />
                    );
                  })}
                  {region.points.map((point, pointIndex) => (
                    <rect
                      key={`vertex-${pointIndex}`}
                      x={point.x - HANDLE_SIZE / 2}
                      y={point.y - HANDLE_SIZE / 2}
                      width={HANDLE_SIZE}
                      height={HANDLE_SIZE}
                      fill={palette.primary.main}
                      style={{ cursor: "move" }}
                      onMouseDown={(e) => onVertexMouseDown(e, i, pointIndex)}
                      onTouchStart={(e) => onVertexTouchStart(e, i, pointIndex)}
                      onDoubleClick={(e) => onVertexDoubleClick(e, i, pointIndex)}
                    />
                  ))}
                </>
              )}
            </g>
          );
        })}
      </Box>
    </ImageModalImage>
  );
};
