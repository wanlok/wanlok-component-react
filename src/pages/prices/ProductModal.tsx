import { useState } from "react";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Edit as EditIcon } from "@mui/icons-material";
import { StyledContainer } from "../../components/StyledContainer";
import { TextInput } from "../../components/TextInput";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";
import { MetaItem } from "../../components/MetaItem";
import { ApiResponse, apiUrl, Product, ProductPrice, ProductType } from "../../services/ApiTypes";

export const ProductModal = ({
  open,
  onClose,
  type,
  name,
  prices = [],
  lowest,
  highest
}: {
  open: boolean;
  onClose: () => void;
  type: ProductType;
  name: string;
  prices?: ProductPrice[];
  lowest?: ProductPrice;
  highest?: ProductPrice;
}) => {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState(name);
  const lastUpdatedDate = prices.length > 0 ? prices[prices.length - 1].datetime.split("T")[0] : undefined;

  const onSaveButtonClick = async () => {
    const response = await fetch(`${apiUrl}/products`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name, newName })
    });
    const result = (await response.json()) as ApiResponse<Record<string, Record<string, Product>>>;
    if (result.status === "ok") {
      queryClient.setQueryData(["products", type], result.data);
    }
  };
  // const { palette } = useTheme();
  // const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(CURRENCY_CODES[0]);
  // const selectedEntry = game[selectedCurrency];
  // const selectedPrices = selectedEntry?.prices ?? [];
  // const lastUpdatedDate =
  //   selectedPrices.length > 0 ? selectedPrices[selectedPrices.length - 1].datetime.split("T")[0] : undefined;
  // const priceValues = selectedPrices.map((price) => price.price);
  // const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : undefined;
  // const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : undefined;
  // const pricePadding = minPrice !== undefined && maxPrice !== undefined ? (maxPrice - minPrice) * 0.8 || 1 : 0;

  return (
    <WModal
      open={open}
      onClose={onClose}
      pages={[{ icon: <EditIcon sx={{ fontSize: 18, mt: 0.1 }} />, label: "Details" }]}
      // top={
      //   <StyledContainer sx={{ flex: 1, p: 1 }}>
      //     <SelectInput
      //       items={CURRENCY_CODES.map((currencyCode) => ({ label: currencyCode.toUpperCase(), value: currencyCode }))}
      //       value={selectedCurrency}
      //       onChange={(value) => setSelectedCurrency(value as CurrencyCode)}
      //     />
      //   </StyledContainer>
      // }
      bottom={
        <YesNoButtons
          yesLabel="Save"
          yesDisabled={!newName}
          onYesClick={async () => {
            await onSaveButtonClick();
            onClose();
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
    >
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
          {prices.length > 0 && <MetaItem title="Number of points" value={String(prices.length)} />}
          {lastUpdatedDate && <MetaItem title="Last Updated" value={lastUpdatedDate} />}
          {lowest && <MetaItem title="Lowest Price" value={`$${lowest.price.toFixed(2)}`} />}
          {highest && <MetaItem title="Highest Price" value={`$${highest.price.toFixed(2)}`} />}
        </Stack>
      </Stack>
      {/* <Stack sx={{ px: 2 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Price Chart
        </Typography>
      </Stack>
      <Stack sx={{ aspectRatio: "4/1" }}>
        <LineChart
          xAxis={[
            {
              data: selectedPrices.map((price) => price.datetime),
              scaleType: "band",
              height: 0,
              disableLine: true,
              disableTicks: true
            }
          ]}
          yAxis={[
            {
              width: 0,
              disableLine: true,
              disableTicks: true,
              min: minPrice !== undefined ? minPrice - pricePadding : undefined,
              max: maxPrice !== undefined ? maxPrice + pricePadding : undefined
            }
          ]}
          axisHighlight={{ x: "none" }}
          series={[
            {
              data: selectedPrices.map((price) => price.price),
              color: palette.text.primary,
              showMark: true,
              curve: "linear"
            }
          ]}
          margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
          slotProps={{
            axisLine: { style: { stroke: palette.divider, strokeWidth: 1 } },
            axisTick: { style: { stroke: "none" } },
            line: { strokeWidth: 1 },
            mark: { style: { fill: palette.common.white, stroke: palette.common.black, strokeWidth: 1 } },
            lineHighlight: { fill: palette.common.black }
          }}
        />
      </Stack> */}
    </WModal>
  );
};
