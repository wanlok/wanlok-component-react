import { Close as CloseIcon, Done as DoneIcon } from "@mui/icons-material";
import { WButton } from "./WButton";

export const YesNoButtons = ({
  yesLabel = "Yes",
  yesDisabled = false,
  onYesClick,
  noLabel = "No",
  onNoClick
}: {
  yesLabel?: string;
  yesDisabled?: boolean;
  onYesClick: () => void;
  noLabel?: string;
  onNoClick?: () => void;
}) => (
  <>
    <WButton disabled={yesDisabled} onClick={onYesClick} sx={{ flex: 1 }}>
      {yesLabel}
    </WButton>
    <WButton onClick={onNoClick} sx={{ flex: 1 }}>
      {noLabel}
    </WButton>
  </>
);
