import { Box } from "@mui/material";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";

export const ImageClipboardModal = ({
  open,
  src,
  onUploadButtonClick,
  onClose
}: {
  open: boolean;
  src: string;
  onUploadButtonClick: () => void;
  onClose: () => void;
}) => (
  <WModal
    open={open}
    onClose={onClose}
    title="Upload Image"
    bottom={<YesNoButtons onYesClick={onUploadButtonClick} onNoClick={onClose} />}
  >
    <Box component="img" src={src} alt="" />
  </WModal>
);
