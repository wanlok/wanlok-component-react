import Tesseract from "tesseract.js";
import { Rect } from "../services/Types";

export const getCanvasAndContext = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  return { canvas, context };
};

export function loadImageData(src: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const { canvas, context } = getCanvasAndContext(image.width, image.height);
      if (context) {
        context.drawImage(image, 0, 0);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      } else {
        reject();
      }
    };
    image.onerror = reject;
  });
}

export const getImageData = (sourceCanvas: HTMLCanvasElement, rect: Rect, context: CanvasRenderingContext2D | null) => {
  const { x, y, width, height } = rect;
  context?.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);
  return context?.getImageData(0, 0, width, height);
};

export function getImageBase64String(sourceCanvas: HTMLCanvasElement, rect: Rect): string | undefined {
  let imageBase64: string | undefined = undefined;
  const { x, y, width, height } = rect;
  const { canvas, context } = getCanvasAndContext(width, height);
  if (context) {
    context.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);
    imageBase64 = canvas.toDataURL("image/png");
  }
  return imageBase64;
}

export async function recognizeText(imageBase64String: string): Promise<string> {
  const { data } = await Tesseract.recognize(imageBase64String, "eng");
  return data.text.trim();
}
