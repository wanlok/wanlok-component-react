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
    <WButton disabled={yesDisabled} onClick={onYesClick} rightIcon={<DoneIcon sx={{ fontSize: 24, mt: "-2px" }} />} sx={{ flex: 1 }}>
      {yesLabel}
    </WButton>
    <WButton onClick={onNoClick} rightIcon={<CloseIcon sx={{ fontSize: 24, mt: "-2px" }} />} sx={{ flex: 1 }}>
      {noLabel}
    </WButton>
  </>
);
