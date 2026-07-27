import { useEffect, useState } from "react";
import { Folder } from "../../services/Types";

export const useImageClipboard = ({
  selectedFolder,
  onUpload
}: {
  selectedFolder: Folder | undefined;
  onUpload: (blob: Blob, name: string) => Promise<void>;
}) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<{ blob: Blob; url: string } | null>(null);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (!selectedFolder) {
        return;
      }
      const items = event.clipboardData?.items;
      if (!items) {
        return;
      }
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          if (blob) {
            setImageBlobUrl({ blob, url: URL.createObjectURL(blob) });
          }
          break;
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [selectedFolder]);

  const onUploadButtonClick = async () => {
    if (imageBlobUrl) {
      const name = `Screenshot ${new Date().toISOString().replace("T", " ").slice(0, 19)}`;
      URL.revokeObjectURL(imageBlobUrl.url);
      setImageBlobUrl(null);
      await onUpload(imageBlobUrl.blob, name);
    }
  };

  const onClose = () => {
    if (imageBlobUrl) {
      URL.revokeObjectURL(imageBlobUrl.url);
    }
    setImageBlobUrl(null);
  };

  return {
    open: Boolean(imageBlobUrl),
    src: imageBlobUrl?.url ?? "",
    onUploadButtonClick,
    onClose
  };
};
