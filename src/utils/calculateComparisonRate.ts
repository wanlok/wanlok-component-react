export const calculateComparisonRate = (
  loanAmount: number,
  actualMonthlyPayment: number,
  numberOfPayments: number,
  applicationFee: number,
  settlementFee: number,
  annualFee: number,
  ongoingFees: number
): number => {
  const upfrontFees = applicationFee + settlementFee;

  const netPresentValue = (monthlyRate: number): number => {
    let presentValue = 0;
    for (let month = numberOfPayments; month >= 1; month--) {
      const fee = month % 12 === 0 ? annualFee : 0;
      const cash = actualMonthlyPayment + ongoingFees + fee;
      presentValue = (presentValue + cash) / (1 + monthlyRate);
    }
    return presentValue + upfrontFees - loanAmount;
  };

  let low = 0;
  let high = 0.01;
  while (netPresentValue(high) > 0) {
    high *= 2;
  }

  for (let i = 0; i < 256; i++) {
    const mid = (low + high) / 2;
    const value = netPresentValue(mid);
    if (value > 0) {
      low = mid;
    } else {
      high = mid;
    }
    if (high - low < 1e-12) {
      break;
    }
  }

  const monthlyComparisonRate = (low + high) / 2;
  return monthlyComparisonRate * 1200;
};
