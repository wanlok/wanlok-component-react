import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Close as CloseIcon, MonetizationOn as MonetizationOnIcon } from "@mui/icons-material";
import { bottomSx, LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { CalculationModal } from "./CalculationModal";
import { DeleteCalculationModal } from "./DeleteCalculationModal";
import { Calculation, useLoanCalculator } from "./useLoanCalculator";
import { MetaItem } from "../../../components/MetaItem";
import { AmortizationSchedule } from "../../../utils/AmortizationUtils";

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
  const paymentFormula = `$${loanAmount.toFixed(2)} × ${(monthlyRate * 100).toFixed(6)}% / (1 - (1 + ${(
    monthlyRate * 100
  ).toFixed(6)}%)^-${numberOfPayments}) = $${payment.toFixed(2)}`;
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
        <MetaItem title={"Loan amount"} value={calculation.loanAmount} hideDivider />
        <MetaItem title={"Interest rate"} value={calculation.interestRate} hideDivider />
        <MetaItem title={"Loan term"} value={calculation.loanTerm} hideDivider />
        <MetaItem
          title={"Monthly rate"}
          value={`${calculation.interestRate} / 100 / 12 = ${(monthlyRate * 100).toFixed(6)}%`}
          hideDivider
        />
      </Stack>
      <Stack sx={{ minWidth: 0, flexShrink: 0 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ "& .MuiTableCell-root": { whiteSpace: "nowrap" } }}>
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
              const interestFormula = `$${row.openingBalance.toFixed(2)} × ${(monthlyRate * 100).toFixed(6)}% = $${row.interest.toFixed(2)}`;
              return (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>
                    <Tooltip title={paymentFormula}>
                      <span>${row.payment.toFixed(2)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={interestFormula}>
                      <span>${row.interest.toFixed(2)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>${row.principal.toFixed(2)}</TableCell>
                  <TableCell>${row.balance.toFixed(2)}</TableCell>
                  <TableCell>{row.percentInterest.toFixed(2)}%</TableCell>
                  <TableCell>{row.percentPrincipal.toFixed(2)}%</TableCell>
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
