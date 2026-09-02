import { useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { Edit as EditIcon } from "@mui/icons-material";
import { StyledContainer } from "../../../components/StyledContainer";
import { TextInput } from "../../../components/TextInput";
import { WModal } from "../../../components/WModal";
import { YesNoButtons } from "../../../components/YesNoButtons";
import { SelectInput } from "../../../components/SelectInput";
import { MetaItem } from "../../../components/MetaItem";
import { CURRENCY_CODES, CurrencyCode, Game } from "../../../services/ApiTypes";

export const DetailsModal = ({
  open,
  onClose,
  name,
  game,
  onSaveButtonClick
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  game: Game;
  onSaveButtonClick: (newName: string) => void;
}) => {
  const { breakpoints, typography, palette } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const [newName, setNewName] = useState(name);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(CURRENCY_CODES[0]);
  const selectedEntry = game[selectedCurrency];
  const selectedPrices = selectedEntry?.prices ?? [];
  const lastUpdatedDate =
    selectedPrices.length > 0 ? selectedPrices[selectedPrices.length - 1].datetime.split("T")[0] : undefined;

  return (
    <WModal
      open={open}
      onClose={onClose}
      pages={[{ icon: <EditIcon sx={{ fontSize: 18, mt: 0.1 }} />, label: "Details" }]}
      top={
        <StyledContainer sx={{ flex: 1, p: 1 }}>
          <SelectInput
            items={CURRENCY_CODES.map((currencyCode) => ({ label: currencyCode.toUpperCase(), value: currencyCode }))}
            value={selectedCurrency}
            onChange={(value) => setSelectedCurrency(value as CurrencyCode)}
          />
        </StyledContainer>
      }
      bottom={
        <YesNoButtons
          yesLabel="Save"
          yesDisabled={!newName}
          onYesClick={() => {
            onSaveButtonClick(newName);
            onClose();
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
    >
      <LineChart
        xAxis={[
          {
            data: selectedPrices.map((price) => price.datetime),
            scaleType: "band",
            height: 40,
            tickSize: 16,
            tickLabelStyle: { fontSize: typography.body2.fontSize, fill: palette.text.secondary },
            valueFormatter: (value: string) => value.split("T")[0]
          }
        ]}
        yAxis={[
          {
            width: 80,
            tickSize: 16,
            tickLabelStyle: { fontSize: typography.body2.fontSize, fill: palette.text.secondary },
            valueFormatter: (value: number) => `$${value.toFixed(2)}`
          }
        ]}
        axisHighlight={{ x: "none" }}
        series={[{ data: selectedPrices.map((price) => price.price), color: palette.text.primary, showMark: true }]}
        height={240}
        margin={{ top: mobile ? 16 : 32, bottom: 0, left: mobile ? -8 : 0, right: 16 }}
        slotProps={{
          axisLine: { style: { stroke: palette.divider, strokeWidth: 1 } },
          axisTick: { style: { stroke: "none" } },
          line: { strokeWidth: 1 },
          mark: { style: { fill: palette.common.white, stroke: palette.common.black, strokeWidth: 1 } },
          lineHighlight: { fill: palette.common.black }
        }}
      />
      <Stack sx={{ p: 2, gap: 2 }}>
        <StyledContainer sx={{ p: 1 }}>
          <TextInput label="Name" value={newName} onChange={(value) => setNewName(value)} inputSx={{ flex: 1 }} />
        </StyledContainer>
        <Stack
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2
          }}
        >
          {selectedPrices.length > 0 && <MetaItem title="Number of data" value={String(selectedPrices.length)} />}
          {lastUpdatedDate && <MetaItem title="Last Updated" value={lastUpdatedDate} />}
          {selectedEntry?.lowest && (
            <MetaItem title="Lowest Price" value={`$${selectedEntry.lowest.price.toFixed(2)}`} hideDivider={true} />
          )}
          {selectedEntry?.highest && (
            <MetaItem title="Highest Price" value={`$${selectedEntry.highest.price.toFixed(2)}`} hideDivider={true} />
          )}
        </Stack>
      </Stack>
    </WModal>
  );
};
