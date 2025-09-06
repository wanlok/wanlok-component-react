import Tesseract from "tesseract.js";

export function toImageData(src: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      resolve(context.getImageData(0, 0, canvas.width, canvas.height));
    };
    image.onerror = reject;
  });
}

export function getImageBase64String(
  sourceCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): string | undefined {
  let imageBase64: string | undefined = undefined;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
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
