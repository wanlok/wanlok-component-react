export interface AmortizationRow {
  month: number;
  monthlyRate: number;
  paymentBasisMonths: number;
  paymentBasisPrincipal: number;
  openingBalance: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
  percentInterest: number;
  percentPrincipal: number;
}

export interface AmortizationPeriod {
  monthlyRate: number;
  numberOfPayments: number;
  paymentBasisMonths: number;
  paymentBasisPrincipal: number;
  payment: number;
}

export interface AmortizationSchedule {
  loanAmount: number;
  numberOfPayments: number;
  rows: AmortizationRow[];
  fixedPeriod?: AmortizationPeriod;
  remainingPeriod: AmortizationPeriod;
}

const calculatePayment = (principal: number, monthlyRate: number, numberOfPayments: number): number => {
  return monthlyRate === 0
    ? principal / numberOfPayments
    : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
};

const buildPeriodRows = (
  startMonth: number,
  startingBalance: number,
  monthlyRate: number,
  paymentBasisMonths: number,
  paymentBasisPrincipal: number,
  payment: number,
  numberOfPayments: number,
  isFinalPeriod: boolean
): { rows: AmortizationRow[]; endingBalance: number } => {
  const rows: AmortizationRow[] = [];
  let balance = startingBalance;
  for (let i = 1; i <= numberOfPayments; i++) {
    const openingBalance = balance;
    const interest = openingBalance * monthlyRate;
    const principal = payment - interest;
    balance -= principal;
    rows.push({
      month: startMonth + i - 1,
      monthlyRate,
      paymentBasisMonths,
      paymentBasisPrincipal,
      openingBalance,
      payment,
      interest,
      principal,
      balance: isFinalPeriod && i === numberOfPayments ? 0 : balance,
      percentInterest: (interest / payment) * 100,
      percentPrincipal: (principal / payment) * 100
    });
  }
  return { rows, endingBalance: balance };
};

export const calculateAmortizationSchedule = (
  loanAmount: number,
  annualInterestRatePercent: number,
  loanTermYears: number,
  fixedAnnualInterestRatePercent = 0,
  fixedLoanTermYears = 0
): AmortizationSchedule => {
  const numberOfPayments = loanTermYears * 12;
  const hasFixedPeriod = fixedAnnualInterestRatePercent > 0 && fixedLoanTermYears > 0;

  if (!hasFixedPeriod) {
    const monthlyRate = annualInterestRatePercent / 100 / 12;
    const payment = calculatePayment(loanAmount, monthlyRate, numberOfPayments);
    const { rows } = buildPeriodRows(
      1,
      loanAmount,
      monthlyRate,
      numberOfPayments,
      loanAmount,
      payment,
      numberOfPayments,
      true
    );
    return {
      loanAmount,
      numberOfPayments,
      rows,
      remainingPeriod: {
        monthlyRate,
        numberOfPayments,
        paymentBasisMonths: numberOfPayments,
        paymentBasisPrincipal: loanAmount,
        payment
      }
    };
  }

  const fixedMonthlyRate = fixedAnnualInterestRatePercent / 100 / 12;
  const fixedNumberOfPayments = fixedLoanTermYears * 12;
  const fixedPayment = calculatePayment(loanAmount, fixedMonthlyRate, numberOfPayments);
  const { rows: fixedRows, endingBalance } = buildPeriodRows(
    1,
    loanAmount,
    fixedMonthlyRate,
    numberOfPayments,
    loanAmount,
    fixedPayment,
    fixedNumberOfPayments,
    false
  );

  const remainingMonthlyRate = annualInterestRatePercent / 100 / 12;
  const remainingNumberOfPayments = numberOfPayments - fixedNumberOfPayments;
  const remainingPayment = calculatePayment(endingBalance, remainingMonthlyRate, remainingNumberOfPayments);
  const { rows: remainingRows } = buildPeriodRows(
    fixedNumberOfPayments + 1,
    endingBalance,
    remainingMonthlyRate,
    remainingNumberOfPayments,
    endingBalance,
    remainingPayment,
    remainingNumberOfPayments,
    true
  );

  return {
    loanAmount,
    numberOfPayments,
    rows: [...fixedRows, ...remainingRows],
    fixedPeriod: {
      monthlyRate: fixedMonthlyRate,
      numberOfPayments: fixedNumberOfPayments,
      paymentBasisMonths: numberOfPayments,
      paymentBasisPrincipal: loanAmount,
      payment: fixedPayment
    },
    remainingPeriod: {
      monthlyRate: remainingMonthlyRate,
      numberOfPayments: remainingNumberOfPayments,
      paymentBasisMonths: remainingNumberOfPayments,
      paymentBasisPrincipal: endingBalance,
      payment: remainingPayment
    }
  };
};
