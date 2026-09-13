import { useState } from "react";

export interface Calculation {
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
}

export const useLoanCalculator = () => {
  const [calculationModalOpen, setCalculationModalOpen] = useState(false);
  const [deleteCalculationModalOpen, setDeleteCalculationModalOpen] = useState(false);
  const [calculation, setCalculation] = useState<Calculation>();

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
    onCalculatorButtonClick,
    onCalculationModalClose,
    onCalculateButtonClick,
    onDeleteButtonClick,
    onDeleteCalculationModalClose,
    onDeleteCalculationConfirm
  };
};
