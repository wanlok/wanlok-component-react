import { Rect } from "../services/Types";

const INK_LUMINANCE_THRESHOLD = 200;
const MIN_INK_PIXELS_PER_LINE = 2;
const MAX_BLANK_ROWS_GAP = 20;
const MAX_RULING_LINE_INK_RATIO = 0.85;
const PADDING = 6;

const getRowInkCounts = (data: Uint8ClampedArray, width: number, height: number) => {
  const rowInkCounts = new Array<number>(height).fill(0);
  for (let y = 0; y < height; y++) {
    let count = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (luminance < INK_LUMINANCE_THRESHOLD) {
        count++;
      }
    }
    rowInkCounts[y] = count;
  }
  return rowInkCounts;
};

const getColumnInkCounts = (data: Uint8ClampedArray, width: number, top: number, bottom: number) => {
  const columnInkCounts = new Array<number>(width).fill(0);
  for (let x = 0; x < width; x++) {
    let count = 0;
    for (let y = top; y <= bottom; y++) {
      const i = (y * width + x) * 4;
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (luminance < INK_LUMINANCE_THRESHOLD) {
        count++;
      }
    }
    columnInkCounts[x] = count;
  }
  return columnInkCounts;
};

// Coordinates below are relative to the fetched slice (top-left = (0, startY)) until explicitly converted to absolute canvas coordinates.
export const detectNextTextRegion = (canvas: HTMLCanvasElement, startY: number): Rect | undefined => {
  const sliceTop = Math.max(0, Math.min(Math.round(startY), canvas.height - 1));
  const sliceHeight = canvas.height - sliceTop;
  if (sliceHeight <= 0) {
    return undefined;
  }
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return undefined;
  }
  const { data, width, height } = context.getImageData(0, sliceTop, canvas.width, sliceHeight);
  const rowInkCounts = getRowInkCounts(data, width, height);

  let contentTop = -1;
  for (let y = 0; y < height; y++) {
    if (rowInkCounts[y] >= MIN_INK_PIXELS_PER_LINE) {
      contentTop = y;
      break;
    }
  }
  if (contentTop === -1) {
    return undefined;
  }

  let contentBottom = contentTop;
  let blankRun = 0;
  for (let y = contentTop; y < height; y++) {
    if (rowInkCounts[y] >= MIN_INK_PIXELS_PER_LINE) {
      contentBottom = y;
      blankRun = 0;
    } else {
      blankRun++;
      if (blankRun >= MAX_BLANK_ROWS_GAP) {
        break;
      }
    }
  }

  const columnInkCounts = getColumnInkCounts(data, width, contentTop, contentBottom);
  const rowCount = contentBottom - contentTop + 1;
  const maxTextColumnInk = rowCount * MAX_RULING_LINE_INK_RATIO;
  let contentLeft = -1;
  let contentRight = -1;
  for (let x = 0; x < width; x++) {
    if (columnInkCounts[x] >= 1 && columnInkCounts[x] <= maxTextColumnInk) {
      if (contentLeft === -1) {
        contentLeft = x;
      }
      contentRight = x;
    }
  }
  if (contentLeft === -1) {
    return undefined;
  }

  const paddedTop = Math.max(0, contentTop - PADDING);
  const paddedBottom = Math.min(height - 1, contentBottom + PADDING);
  const paddedLeft = Math.max(0, contentLeft - PADDING);
  const paddedRight = Math.min(width - 1, contentRight + PADDING);

  return {
    x: paddedLeft,
    y: sliceTop + paddedTop,
    width: paddedRight - paddedLeft + 1,
    height: paddedBottom - paddedTop + 1
  };
};
