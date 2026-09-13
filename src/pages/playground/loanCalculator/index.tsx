import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Close as CloseIcon, MonetizationOn as MonetizationOnIcon } from "@mui/icons-material";
import { bottomSx, LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { CalculationModal } from "./CalculationModal";
import { DeleteCalculationModal } from "./DeleteCalculationModal";
import { Calculation, useLoanCalculator } from "./useLoanCalculator";
import { MetaItem } from "../../../components/MetaItem";
import { AmortizationSchedule } from "../../../utils/AmortizationUtils";
import { formatCurrency } from "../../../utils/formatCurrency";
import { calculateComparisonRate } from "../../../utils/calculateComparisonRate";

const renderTooltip = (lines: string[]) => (
  <Stack sx={{ gap: 0.5 }}>
    {lines.map((line, i) => (
      <Typography key={i} variant="body2" sx={{ whiteSpace: "nowrap" }}>
        {line}
      </Typography>
    ))}
  </Stack>
);

const Content = ({
  calculation,
  schedule
}: {
  calculation: Calculation | undefined;
  schedule: AmortizationSchedule;
}) => {
  if (!calculation) {
    return (
      <Stack sx={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body1">No calculation</Typography>
      </Stack>
    );
  }
  const { loanAmount, numberOfPayments, rows, fixedPeriod, remainingPeriod } = schedule;
  const applicationFee = Number(calculation.applicationFee);
  const settlementFee = Number(calculation.settlementFee);
  const annualFee = Number(calculation.annualFee);
  const ongoingFees = Number(calculation.ongoingFees);
  const numberOfYears = numberOfPayments / 12;
  const totalAmountToBePaidBack =
    rows.reduce((sum, row) => sum + row.payment, 0) +
    applicationFee +
    settlementFee +
    annualFee * numberOfYears +
    ongoingFees * numberOfPayments;
  const comparisonRate = calculateComparisonRate(
    loanAmount,
    rows.map((row) => row.payment),
    applicationFee,
    settlementFee,
    annualFee,
    ongoingFees
  );
  return (
    <Stack sx={{ flex: 1, minHeight: 0, minWidth: 0, overflow: "auto" }}>
      <Stack
        sx={{
          p: 2,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" },
          gap: 2,
          position: "sticky",
          left: 0
        }}
      >
        <MetaItem
          title={"Loan amount"}
          value={formatCurrency(Number(calculation.loanAmount))}
          tooltip={renderTooltip(["Inputted by user"])}
          hideDivider
        />
        <MetaItem
          title={"Interest rate"}
          value={`${calculation.interestRate}%`}
          tooltip={renderTooltip(["Inputted by user"])}
          hideDivider
        />
        <MetaItem
          title={"Personalised comparison rate"}
          value={`${comparisonRate.toFixed(2)}%`}
          tooltip={renderTooltip([
            "= rate r that solves NPV(r) = 0 for the fee-inclusive repayment stream",
            "= found via bisection search, not a closed-form substitution",
            `= ${comparisonRate.toFixed(2)}%`
          ])}
          hideDivider
        />
        <MetaItem
          title={"Loan term (in years)"}
          value={calculation.loanTerm}
          tooltip={renderTooltip(["Inputted by user"])}
          hideDivider
        />
        <MetaItem
          title={"Fixed interest rate"}
          value={`${calculation.fixedInterestRate}%`}
          tooltip={renderTooltip(["Inputted by user"])}
          hideDivider
        />
        <MetaItem
          title={"Fixed loan term (in years)"}
          value={calculation.fixedLoanTerm}
          tooltip={renderTooltip(["Inputted by user"])}
          hideDivider
        />
        <MetaItem
          title={"Application fee"}
          value={formatCurrency(applicationFee)}
          tooltip={renderTooltip(["Inputted by user"])}
          hideDivider
        />
        <MetaItem
          title={"Settlement fee"}
          value={formatCurrency(settlementFee)}
          tooltip={renderTooltip(["Inputted by user"])}
          hideDivider
        />
        <MetaItem
          title={"Annual fee"}
          value={formatCurrency(annualFee)}
          tooltip={renderTooltip(["Inputted by user"])}
          hideDivider
        />
        <MetaItem
          title={"Ongoing fees"}
          value={formatCurrency(ongoingFees)}
          tooltip={renderTooltip(["Inputted by user"])}
          hideDivider
        />
        <MetaItem
          title={"Monthly rate"}
          value={`${(remainingPeriod.monthlyRate * 100).toFixed(6)}%`}
          tooltip={renderTooltip([
            "= interest rate / 100 / 12",
            `= ${calculation.interestRate} / 100 / 12`,
            `= ${(remainingPeriod.monthlyRate * 100).toFixed(6)}%`
          ])}
          hideDivider
        />
        <MetaItem
          title={"Total amount to be paid back"}
          value={formatCurrency(totalAmountToBePaidBack)}
          tooltip={renderTooltip([
            "= (sum of all payments) + application fee + settlement fee + (annual fee × number of years) + (ongoing fees × number of payments)",
            `= ${formatCurrency(rows.reduce((sum, row) => sum + row.payment, 0))} + ${formatCurrency(applicationFee)} + ${formatCurrency(settlementFee)} + (${formatCurrency(annualFee)} × ${numberOfYears}) + (${formatCurrency(ongoingFees)} × ${numberOfPayments})`,
            `= ${formatCurrency(totalAmountToBePaidBack)}`
          ])}
          hideDivider
        />
        <MetaItem
          title={"This means you will pay back"}
          value={`$${(totalAmountToBePaidBack / loanAmount).toFixed(2)} for every $1 borrowed`}
          tooltip={renderTooltip([
            "= total amount to be paid back / loan amount",
            `= ${formatCurrency(totalAmountToBePaidBack)} / ${formatCurrency(loanAmount)}`,
            `= ${(totalAmountToBePaidBack / loanAmount).toFixed(2)}`
          ])}
          hideDivider
        />
        {fixedPeriod ? (
          <>
            <MetaItem
              title={`Repayment per month for the first ${calculation.fixedLoanTerm} years (including ongoing fees)`}
              value={formatCurrency(fixedPeriod.payment + ongoingFees)}
              tooltip={renderTooltip([
                "= fixed period payment + ongoing fees",
                `= ${formatCurrency(fixedPeriod.payment)} + ${formatCurrency(ongoingFees)}`,
                `= ${formatCurrency(fixedPeriod.payment + ongoingFees)}`
              ])}
              hideDivider
            />
            <MetaItem
              title={`Repayment per year for the first ${calculation.fixedLoanTerm} years (including ongoing fees)`}
              value={formatCurrency((fixedPeriod.payment + ongoingFees) * 12)}
              tooltip={renderTooltip([
                "= repayment per month for the first fixed years × 12",
                `= ${formatCurrency(fixedPeriod.payment + ongoingFees)} × 12`,
                `= ${formatCurrency((fixedPeriod.payment + ongoingFees) * 12)}`
              ])}
              hideDivider
            />
            <MetaItem
              title={`Repayment per month after ${calculation.fixedLoanTerm} years (including ongoing fees)`}
              value={formatCurrency(remainingPeriod.payment + ongoingFees)}
              tooltip={renderTooltip([
                "= remaining period payment + ongoing fees",
                `= ${formatCurrency(remainingPeriod.payment)} + ${formatCurrency(ongoingFees)}`,
                `= ${formatCurrency(remainingPeriod.payment + ongoingFees)}`
              ])}
              hideDivider
            />
            <MetaItem
              title={`Repayment per year after ${calculation.fixedLoanTerm} years (including ongoing fees)`}
              value={formatCurrency((remainingPeriod.payment + ongoingFees) * 12)}
              tooltip={renderTooltip([
                "= repayment per month after fixed years × 12",
                `= ${formatCurrency(remainingPeriod.payment + ongoingFees)} × 12`,
                `= ${formatCurrency((remainingPeriod.payment + ongoingFees) * 12)}`
              ])}
              hideDivider
            />
          </>
        ) : (
          <>
            <MetaItem
              title={"Repayment per month (including ongoing fees)"}
              value={formatCurrency(remainingPeriod.payment + ongoingFees)}
              tooltip={renderTooltip([
                "= payment + ongoing fees",
                `= ${formatCurrency(remainingPeriod.payment)} + ${formatCurrency(ongoingFees)}`,
                `= ${formatCurrency(remainingPeriod.payment + ongoingFees)}`
              ])}
              hideDivider
            />
            <MetaItem
              title={"Repayment per year (including ongoing fees)"}
              value={formatCurrency((remainingPeriod.payment + ongoingFees) * 12)}
              tooltip={renderTooltip([
                "= repayment per month × 12",
                `= ${formatCurrency(remainingPeriod.payment + ongoingFees)} × 12`,
                `= ${formatCurrency((remainingPeriod.payment + ongoingFees) * 12)}`
              ])}
              hideDivider
            />
          </>
        )}
      </Stack>
      <Stack sx={{ minWidth: 0, flexShrink: 0 }}>
        <Table stickyHeader sx={{ "& .MuiTableCell-root": { typography: "body1", borderBottomWidth: 0 } }}>
          <TableHead>
            <TableRow
              sx={{
                "& .MuiTableCell-root": {
                  whiteSpace: "nowrap",
                  backgroundColor: "common.black",
                  color: "common.white"
                }
              }}
            >
              <TableCell>Month</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Interest</TableCell>
              <TableCell>Principal</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>% Interest</TableCell>
              <TableCell>% Principal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const paymentFormula = renderTooltip([
                "= payment basis principal × monthly rate / (1 - (1 + monthly rate)^-payment basis months)",
                `= ${formatCurrency(row.paymentBasisPrincipal)} × ${(row.monthlyRate * 100).toFixed(6)}% / (1 - (1 + ${(row.monthlyRate * 100).toFixed(6)}%)^-${row.paymentBasisMonths})`,
                `= ${formatCurrency(row.payment)}`
              ]);
              const interestFormula = renderTooltip([
                "= opening balance × monthly rate",
                `= ${formatCurrency(row.openingBalance)} × ${(row.monthlyRate * 100).toFixed(6)}%`,
                `= ${formatCurrency(row.interest)}`
              ]);
              const principalFormula = renderTooltip([
                "= payment - interest",
                `= ${formatCurrency(row.payment)} - ${formatCurrency(row.interest)}`,
                `= ${formatCurrency(row.principal)}`
              ]);
              const balanceFormula = renderTooltip([
                "= opening balance - principal",
                `= ${formatCurrency(row.openingBalance)} - ${formatCurrency(row.principal)}`,
                `= ${formatCurrency(row.balance)}`
              ]);
              const percentInterestFormula = renderTooltip([
                "= interest / payment",
                `= ${formatCurrency(row.interest)} / ${formatCurrency(row.payment)}`,
                `= ${row.percentInterest.toFixed(2)}%`
              ]);
              const percentPrincipalFormula = renderTooltip([
                "= principal / payment",
                `= ${formatCurrency(row.principal)} / ${formatCurrency(row.payment)}`,
                `= ${row.percentPrincipal.toFixed(2)}%`
              ]);
              return (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>
                    <Tooltip title={paymentFormula} arrow slotProps={{ tooltip: { sx: { maxWidth: "none" } } }}>
                      <Typography component="span" variant="body1">
                        {formatCurrency(row.payment)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={interestFormula} arrow slotProps={{ tooltip: { sx: { maxWidth: "none" } } }}>
                      <Typography component="span" variant="body1">
                        {formatCurrency(row.interest)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={principalFormula} arrow slotProps={{ tooltip: { sx: { maxWidth: "none" } } }}>
                      <Typography component="span" variant="body1">
                        {formatCurrency(row.principal)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={balanceFormula} arrow slotProps={{ tooltip: { sx: { maxWidth: "none" } } }}>
                      <Typography component="span" variant="body1">
                        {formatCurrency(row.balance)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={percentInterestFormula} arrow slotProps={{ tooltip: { sx: { maxWidth: "none" } } }}>
                      <Typography component="span" variant="body1">
                        {row.percentInterest.toFixed(2)}%
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={percentPrincipalFormula}
                      arrow
                      slotProps={{ tooltip: { sx: { maxWidth: "none" } } }}
                    >
                      <Typography component="span" variant="body1">
                        {row.percentPrincipal.toFixed(2)}%
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Stack>
    </Stack>
  );
};

export const Index = () => {
  const {
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
              {calculation && (
                <WButton onClick={onDeleteButtonClick} sx={iconButtonSx}>
                  <CloseIcon sx={{ fontSize: 24 }} />
                </WButton>
              )}
            </Stack>
          </Stack>
        }
        bottom={<Stack sx={[bottomSx]} />}
      />
      <Content calculation={calculation} schedule={schedule} />
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
