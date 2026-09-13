import { useState } from "react";
import { Stack } from "@mui/material";
import { MonetizationOn as MonetizationOnIcon } from "@mui/icons-material";
import { StyledContainer } from "../../../components/StyledContainer";
import { TextInput } from "../../../components/TextInput";
import { WModal } from "../../../components/WModal";
import { YesNoButtons } from "../../../components/YesNoButtons";
import { Calculation } from "./useLoanCalculator";

export const CalculationModal = ({
  open,
  onClose,
  onCalculateButtonClick
}: {
  open: boolean;
  onClose: () => void;
  onCalculateButtonClick: (calculation: Calculation) => void;
}) => {
  const [loanAmount, setLoanAmount] = useState("400000");
  const [interestRate, setInterestRate] = useState("6.14");
  const [loanTerm, setLoanTerm] = useState("30");

  return (
    <WModal
      open={open}
      onClose={onClose}
      pages={[{ icon: <MonetizationOnIcon sx={{ fontSize: 24 }} />, label: "Calculation" }]}
      bottom={
        <YesNoButtons
          yesLabel="Calculate"
          yesDisabled={!loanAmount || !interestRate || !loanTerm}
          onYesClick={() => {
            onCalculateButtonClick({ loanAmount, interestRate, loanTerm });
            onClose();
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
    >
      <Stack sx={{ p: 2, gap: "1px" }}>
        <StyledContainer sx={{ p: 1 }}>
          <TextInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} inputSx={{ flex: 1 }} />
        </StyledContainer>
        <StyledContainer sx={{ p: 1 }}>
          <TextInput label="Interest Rate" value={interestRate} onChange={setInterestRate} inputSx={{ flex: 1 }} />
        </StyledContainer>
        <StyledContainer sx={{ p: 1 }}>
          <TextInput label="Loan Term (in years)" value={loanTerm} onChange={setLoanTerm} inputSx={{ flex: 1 }} />
        </StyledContainer>
      </Stack>
    </WModal>
  );
};
