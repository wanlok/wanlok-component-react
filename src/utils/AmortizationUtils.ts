export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
  percentInterest: number;
  percentPrincipal: number;
}

export const calculateAmortizationSchedule = (
  loanAmount: number,
  annualInterestRatePercent: number,
  loanTermYears: number
): AmortizationRow[] => {
  const monthlyRate = annualInterestRatePercent / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const payment =
    monthlyRate === 0
      ? loanAmount / numberOfPayments
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

  const rows: AmortizationRow[] = [];
  let balance = loanAmount;
  for (let month = 1; month <= numberOfPayments; month++) {
    const interest = balance * monthlyRate;
    const principal = payment - interest;
    balance -= principal;
    rows.push({
      month,
      payment,
      interest,
      principal,
      balance: month === numberOfPayments ? 0 : balance,
      percentInterest: (interest / payment) * 100,
      percentPrincipal: (principal / payment) * 100
    });
  }
  return rows;
};
