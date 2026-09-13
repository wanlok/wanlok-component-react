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
  const { loanAmount, monthlyRate, numberOfPayments, payment, rows } = schedule;
  const paymentFormula = `${formatCurrency(loanAmount)} × ${(monthlyRate * 100).toFixed(6)}% / (1 - (1 + ${(
    monthlyRate * 100
  ).toFixed(6)}%)^-${numberOfPayments}) = ${formatCurrency(payment)}`;
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
        <MetaItem title={"Loan amount"} value={formatCurrency(Number(calculation.loanAmount))} hideDivider />
        <MetaItem title={"Interest rate"} value={`${calculation.interestRate}%`} hideDivider />
        <MetaItem title={"Loan term (in years)"} value={calculation.loanTerm} hideDivider />
        <MetaItem
          title={"Monthly rate"}
          value={`${(monthlyRate * 100).toFixed(6)}%`}
          tooltip={`${calculation.interestRate} / 100 / 12 = ${(monthlyRate * 100).toFixed(6)}%`}
          hideDivider
        />
        <MetaItem
          title={"Total amount to be paid back"}
          value={formatCurrency(payment * numberOfPayments)}
          tooltip={`${formatCurrency(payment)} × ${numberOfPayments} = ${formatCurrency(payment * numberOfPayments)}`}
          hideDivider
        />
        <MetaItem
          title={"This means you will pay back"}
          value={`$${((payment * numberOfPayments) / loanAmount).toFixed(2)} for every $1 borrowed`}
          tooltip={`${formatCurrency(payment * numberOfPayments)} / ${formatCurrency(loanAmount)} = ${((payment * numberOfPayments) / loanAmount).toFixed(2)}`}
          hideDivider
        />
        <MetaItem
          title={"Repayment per month (including ongoing fees)"}
          value={formatCurrency(payment)}
          tooltip={`${formatCurrency(payment)} + $0.00 = ${formatCurrency(payment)}`}
          hideDivider
        />
        <MetaItem
          title={"Repayment per year (including ongoing fees)"}
          value={formatCurrency(payment * 12)}
          tooltip={`${formatCurrency(payment)} × 12 = ${formatCurrency(payment * 12)}`}
          hideDivider
        />
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
              const interestFormula = `${formatCurrency(row.openingBalance)} × ${(monthlyRate * 100).toFixed(6)}% = ${formatCurrency(row.interest)}`;
              const principalFormula = `${formatCurrency(row.payment)} - ${formatCurrency(row.interest)} = ${formatCurrency(row.principal)}`;
              const balanceFormula = `${formatCurrency(row.openingBalance)} - ${formatCurrency(row.principal)} = ${formatCurrency(row.balance)}`;
              const percentInterestFormula = `${formatCurrency(row.interest)} / ${formatCurrency(row.payment)} = ${row.percentInterest.toFixed(2)}%`;
              const percentPrincipalFormula = `${formatCurrency(row.principal)} / ${formatCurrency(row.payment)} = ${row.percentPrincipal.toFixed(2)}%`;
              return (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>
                    <Tooltip title={paymentFormula} arrow>
                      <Typography component="span" variant="body1">
                        {formatCurrency(row.payment)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={interestFormula} arrow>
                      <Typography component="span" variant="body1">
                        {formatCurrency(row.interest)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={principalFormula} arrow>
                      <Typography component="span" variant="body1">
                        {formatCurrency(row.principal)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={balanceFormula} arrow>
                      <Typography component="span" variant="body1">
                        {formatCurrency(row.balance)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={percentInterestFormula} arrow>
                      <Typography component="span" variant="body1">
                        {row.percentInterest.toFixed(2)}%
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={percentPrincipalFormula} arrow>
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
              <WButton onClick={onDeleteButtonClick} sx={iconButtonSx}>
                <CloseIcon sx={{ fontSize: 24 }} />
              </WButton>
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
