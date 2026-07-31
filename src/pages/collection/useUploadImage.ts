import { useEffect, useState } from "react";
import { Folder } from "../../services/Types";
import { getDateTimeString } from "../../common/DateUtils";

export const useUploadImage = ({
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
      URL.revokeObjectURL(imageBlobUrl.url);
      setImageBlobUrl(null);
      await onUpload(imageBlobUrl.blob, getDateTimeString(new Date()));
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
