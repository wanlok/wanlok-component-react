const maxDimension = 1920;

export const resizeImageBlob = async (blob: Blob, mimeType: string): Promise<Blob> => {
  const bitmap = await createImageBitmap(blob);
  const { width, height } = bitmap;
  if (width <= maxDimension && height <= maxDimension) {
    bitmap.close();
    return blob;
  }

  const scale = maxDimension / Math.max(width, height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return blob;
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((resizedBlob) => (resizedBlob ? resolve(resizedBlob) : reject(new Error("canvas.toBlob failed"))), mimeType)
  );
};
