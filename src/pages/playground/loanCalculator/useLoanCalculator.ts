import { useMemo, useState } from "react";
import { AmortizationSchedule, calculateAmortizationSchedule } from "../../../utils/AmortizationUtils";

export interface Calculation {
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
  fixedInterestRate: string;
  fixedLoanTerm: string;
  applicationFee: string;
  settlementFee: string;
  annualFee: string;
  ongoingFees: string;
}

const emptySchedule: AmortizationSchedule = {
  loanAmount: 0,
  numberOfPayments: 0,
  rows: [],
  remainingPeriod: { monthlyRate: 0, numberOfPayments: 0, paymentBasisMonths: 0, paymentBasisPrincipal: 0, payment: 0 }
};

export const useLoanCalculator = () => {
  const [calculationModalOpen, setCalculationModalOpen] = useState(false);
  const [deleteCalculationModalOpen, setDeleteCalculationModalOpen] = useState(false);
  const [calculation, setCalculation] = useState<Calculation>();

  const schedule = useMemo<AmortizationSchedule>(() => {
    if (!calculation) {
      return emptySchedule;
    }
    return calculateAmortizationSchedule(
      Number(calculation.loanAmount),
      Number(calculation.interestRate),
      Number(calculation.loanTerm),
      Number(calculation.fixedInterestRate),
      Number(calculation.fixedLoanTerm)
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
