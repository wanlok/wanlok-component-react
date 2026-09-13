import { Stack, Typography } from "@mui/material";
import { Close as CloseIcon, MonetizationOn as MonetizationOnIcon } from "@mui/icons-material";
import { bottomSx, LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { CalculationModal } from "./CalculationModal";
import { DeleteCalculationModal } from "./DeleteCalculationModal";
import { Calculation, useLoanCalculator } from "./useLoanCalculator";
import { MetaItem } from "../../../components/MetaItem";

const Content = ({ calculation }: { calculation: Calculation | undefined }) => {
  if (!calculation) {
    return (
      <Stack sx={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body1">No calculation</Typography>
      </Stack>
    );
  }
  return (
    <Stack sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", p: 2, gap: 2 }}>
      <MetaItem title={"Loan amount"} value={calculation.loanAmount} />
      <MetaItem title={"Interest rate"} value={calculation.interestRate} />
      <MetaItem title={"Loan term"} value={calculation.loanTerm} />
    </Stack>
  );
};

export const Index = () => {
  const {
    calculationModalOpen,
    deleteCalculationModalOpen,
    calculation,
    onCalculatorButtonClick,
    onCalculationModalClose,
    onCalculateButtonClick,
    onDeleteButtonClick,
    onDeleteCalculationModalClose,
    onDeleteCalculationConfirm
  } = useLoanCalculator();

  return (
    <Stack sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
      <LayoutHeader
        top={
          <Stack sx={[topSx]}>
            <Stack sx={{ flex: 1, px: 2, justifyContent: "center" }}>
              <Typography variant="body1">Loan Calculator</Typography>
            </Stack>
            <Stack sx={{ flexDirection: "row", gap: "1px" }}>
              <WButton onClick={onCalculatorButtonClick} sx={iconButtonSx}>
                <MonetizationOnIcon sx={{ fontSize: 24 }} />
              </WButton>
              <WButton onClick={onDeleteButtonClick} sx={iconButtonSx}>
                <CloseIcon sx={{ fontSize: 24 }} />
              </WButton>
            </Stack>
          </Stack>
        }
        bottom={<Stack sx={[bottomSx]} />}
      />
      <Content calculation={calculation} />
      <CalculationModal
        open={calculationModalOpen}
        onClose={onCalculationModalClose}
        onCalculateButtonClick={onCalculateButtonClick}
      />
      <DeleteCalculationModal
        open={deleteCalculationModalOpen}
        onClose={onDeleteCalculationModalClose}
        onConfirm={onDeleteCalculationConfirm}
      />
    </Stack>
  );
};
