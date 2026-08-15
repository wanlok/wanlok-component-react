import type { Mat } from "@techstark/opencv-js";
import { RegionPoint } from "../services/Types";
import { loadOpenCv } from "./loadOpenCv";

const CANNY_LOW_THRESHOLD = 50;
const CANNY_HIGH_THRESHOLD = 150;
const DILATE_KERNEL_SIZE = 3;
const DILATE_ITERATIONS = 2;
const COLOR_DISTANCE_TOLERANCE = 32;
const MASK_FILL_VALUE = 128;
const MAX_POLYGON_POINTS = 60;
const MIN_EPSILON_RATIO = 0.002;
const EPSILON_GROWTH_FACTOR = 1.5;
const MAX_EPSILON_ITERATIONS = 20;
const MIN_FILL_POINTS = 3;

export const floodFillRegion = async (
  canvas: HTMLCanvasElement,
  seedX: number,
  seedY: number
): Promise<RegionPoint[] | undefined> => {
  const x = Math.round(seedX);
  const y = Math.round(seedY);
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
    return undefined;
  }

  const cv = await loadOpenCv();

  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();
  const dilated = new cv.Mat();
  const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(DILATE_KERNEL_SIZE, DILATE_KERNEL_SIZE));
  const mask = new cv.Mat();
  const fillTarget = new cv.Mat();
  const filledMask = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  let contour: Mat | undefined;
  let approxCurve: Mat | undefined;

  try {
    // Detect the border strokes as edges (not by color difference — this is what lets the fill
    // stop at a border even when the areas on both sides of it share the exact same fill color).
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, blurred, new cv.Size(3, 3), 0);
    cv.Canny(blurred, edges, CANNY_LOW_THRESHOLD, CANNY_HIGH_THRESHOLD);
    // Bridge dashed/dotted border gaps into a continuous barrier.
    cv.dilate(edges, dilated, kernel, new cv.Point(-1, -1), DILATE_ITERATIONS);

    // OpenCV's masked floodFill requires a mask 2px wider/taller than the image, and treats any
    // non-zero mask pixel as an impassable barrier — pre-seed it with the dilated edges.
    cv.copyMakeBorder(dilated, mask, 1, 1, 1, 1, cv.BORDER_CONSTANT, [0, 0, 0, 0]);
    // floodFill only accepts 1- or 3-channel images — src is RGBA (4 channels) from cv.imread.
    cv.cvtColor(src, fillTarget, cv.COLOR_RGBA2RGB);

    const seedPoint = new cv.Point(x, y);
    const tolerance = [COLOR_DISTANCE_TOLERANCE, COLOR_DISTANCE_TOLERANCE, COLOR_DISTANCE_TOLERANCE, 0];
    // 4-connectivity, mask-only fill, newly-filled mask pixels get MASK_FILL_VALUE (distinct from
    // the pre-existing edge-barrier value of 255) so they can be isolated afterward.
    const flags = 4 | cv.FLOODFILL_MASK_ONLY | (MASK_FILL_VALUE << 8);
    cv.floodFill(fillTarget, mask, seedPoint, [255, 255, 255, 255], new cv.Rect(), tolerance, tolerance, flags);

    const compareTarget = new cv.Mat(mask.rows, mask.cols, mask.type(), [
      MASK_FILL_VALUE,
      MASK_FILL_VALUE,
      MASK_FILL_VALUE,
      MASK_FILL_VALUE
    ]);
    cv.compare(mask, compareTarget, filledMask, cv.CMP_EQ);
    compareTarget.delete();

    cv.findContours(filledMask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    if (contours.size() === 0) {
      return undefined;
    }

    let largestIndex = 0;
    let largestArea = -1;
    for (let i = 0; i < contours.size(); i++) {
      const candidate = contours.get(i);
      const area = cv.contourArea(candidate);
      if (area > largestArea) {
        largestArea = area;
        largestIndex = i;
      }
      candidate.delete();
    }
    contour = contours.get(largestIndex);

    const bbox = cv.boundingRect(contour);
    const diagonal = Math.hypot(bbox.width, bbox.height);
    let epsilon = Math.max(1, diagonal * MIN_EPSILON_RATIO);
    approxCurve = new cv.Mat();
    cv.approxPolyDP(contour, approxCurve, epsilon, true);
    let iterations = 0;
    while (approxCurve.rows > MAX_POLYGON_POINTS && iterations < MAX_EPSILON_ITERATIONS) {
      epsilon *= EPSILON_GROWTH_FACTOR;
      approxCurve.delete();
      approxCurve = new cv.Mat();
      cv.approxPolyDP(contour, approxCurve, epsilon, true);
      iterations++;
    }

    if (approxCurve.rows < MIN_FILL_POINTS) {
      return undefined;
    }

    const points: RegionPoint[] = [];
    const data = approxCurve.data32S;
    for (let i = 0; i < approxCurve.rows; i++) {
      // -1 to undo the 1px padding copyMakeBorder added.
      points.push({ x: data[i * 2] - 1, y: data[i * 2 + 1] - 1 });
    }
    return points;
  } catch (error) {
    // OpenCV.js WASM exceptions can surface as a raw numeric pointer instead of an Error object —
    // decode it via cv.exceptionFromPtr to get the actual C++ exception message.
    const decoded = typeof error === "number" ? cv.exceptionFromPtr(error) : error;
    console.error("floodFillRegion failed", decoded);
    return undefined;
  } finally {
    src.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    dilated.delete();
    kernel.delete();
    mask.delete();
    fillTarget.delete();
    filledMask.delete();
    contours.delete();
    hierarchy.delete();
    contour?.delete();
    approxCurve?.delete();
  }
};
