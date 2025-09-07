import Tesseract from "tesseract.js";
import { Rect } from "../services/Types";

export const scaleRect = (rect: Rect) => {
  const dpr = window.devicePixelRatio || 1;
  return {
    x: rect.x * dpr,
    y: rect.y * dpr,
    width: rect.width * dpr,
    height: rect.height * dpr
  };
};

export const getCanvasAndContext = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  return { canvas, context };
};

export const loadImageData = (src: string): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const { context } = getCanvasAndContext(image.width, image.height);
      if (context) {
        context.drawImage(image, 0, 0, image.width, image.height);
        resolve(context.getImageData(0, 0, image.width, image.height));
      } else {
        reject();
      }
    };
    image.onerror = reject;
  });
};

export const resizeImageData = (source: ImageData, targetWidth: number, targetHeight: number) => {
  const { context } = getCanvasAndContext(targetWidth, targetHeight);
  const { canvas: sourceCanvas, context: sourceContext } = getCanvasAndContext(source.width, source.height);
  sourceContext?.putImageData(source, 0, 0);
  context?.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
  return context?.getImageData(0, 0, targetWidth, targetHeight);
};

export const getImageData = (sourceCanvas: HTMLCanvasElement, rect: Rect, context: CanvasRenderingContext2D | null) => {
  const { x, y, width, height } = rect;
  context?.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);
  return context?.getImageData(0, 0, width, height);
};

export const getImageBase64String = (sourceCanvas: HTMLCanvasElement, rect: Rect) => {
  let imageBase64: string | undefined = undefined;
  const { x, y, width, height } = rect;
  const { canvas, context } = getCanvasAndContext(width, height);
  if (context) {
    context.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);
    imageBase64 = canvas.toDataURL("image/png");
  }
  return imageBase64;
};

export const recognizeText = async (imageBase64String: string) => {
  const { data } = await Tesseract.recognize(imageBase64String, "eng");
  return data.text.trim();
};
