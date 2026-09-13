import { useMemo, useState } from "react";
import { AmortizationRow, calculateAmortizationSchedule } from "../../../utils/AmortizationUtils";

export interface Calculation {
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
}

export const useLoanCalculator = () => {
  const [calculationModalOpen, setCalculationModalOpen] = useState(false);
  const [deleteCalculationModalOpen, setDeleteCalculationModalOpen] = useState(false);
  const [calculation, setCalculation] = useState<Calculation>();

  const schedule = useMemo<AmortizationRow[]>(() => {
    if (!calculation) {
      return [];
    }
    return calculateAmortizationSchedule(
      Number(calculation.loanAmount),
      Number(calculation.interestRate),
      Number(calculation.loanTerm)
    );
  }, [calculation]);

  const onCalculatorButtonClick = () => {
    setCalculationModalOpen(true);
  };

  const onCalculationModalClose = () => {
    setCalculationModalOpen(false);
  };

  const onCalculateButtonClick = (calculation: Calculation) => {
    setCalculation(calculation);
  };

  const onDeleteButtonClick = () => {
    setDeleteCalculationModalOpen(true);
  };

  const onDeleteCalculationModalClose = () => {
    setDeleteCalculationModalOpen(false);
  };

  const onDeleteCalculationConfirm = () => {
    setCalculation(undefined);
  };

  return {
    calculationModalOpen,
    deleteCalculationModalOpen,
    calculation,
    schedule,
    onCalculatorButtonClick,
    onCalculationModalClose,
    onCalculateButtonClick,
    onDeleteButtonClick,
    onDeleteCalculationModalClose,
    onDeleteCalculationConfirm
  };
};
