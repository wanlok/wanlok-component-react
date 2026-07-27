import { Box } from "@mui/material";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";

export const ClipboardImageModal = ({
  open,
  previewUrl,
  onUploadButtonClick,
  onClose
}: {
  open: boolean;
  previewUrl: string;
  onUploadButtonClick: () => void;
  onClose: () => void;
}) => (
  <WModal
    open={open}
    onClose={onClose}
    title="Paste Image"
    bottom={<YesNoButtons yesLabel="Upload" onYesClick={onUploadButtonClick} noLabel="Cancel" onNoClick={onClose} />}
  >
    <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
      <img
        src={previewUrl}
        alt="Clipboard preview"
        style={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain" }}
      />
    </Box>
  </WModal>
);
