import { useState } from "react";
import { Divider, Stack, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useQueryClient } from "@tanstack/react-query";
import { Edit as EditIcon, Insights as InsightsIcon } from "@mui/icons-material";
import { StyledContainer } from "../../components/StyledContainer";
import { TextInput } from "../../components/TextInput";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";
import { SelectInput } from "../../components/SelectInput";
import { MetaItem } from "../../components/MetaItem";
import { ApiResponse, apiUrl, Product, ProductType } from "../../services/ApiTypes";

export const ProductModal = ({
  open,
  onClose,
  type,
  name,
  sellers
}: {
  open: boolean;
  onClose: () => void;
  type: ProductType;
  name: string;
  sellers: Record<string, Product>;
}) => {
  const { palette } = useTheme();
  const queryClient = useQueryClient();
  const [mobileSelectedPage, setMobileSelectedPage] = useState(0);
  const [newName, setNewName] = useState(name);
  const [selectedUrl, setSelectedUrl] = useState(Object.keys(sellers)[0] ?? "");
  const prices = sellers[selectedUrl]?.prices ?? [];
  const lastUpdatedDate = prices.length > 0 ? prices[prices.length - 1].datetime.split("T")[0] : undefined;
  const lowest = prices.length > 0 ? prices.reduce((a, b) => (b.price < a.price ? b : a)) : undefined;
  const highest = prices.length > 0 ? prices.reduce((a, b) => (b.price > a.price ? b : a)) : undefined;
  const priceValues = prices.map((price) => price.price);
  const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : undefined;
  const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : undefined;
  const pricePadding = minPrice !== undefined && maxPrice !== undefined ? (maxPrice - minPrice) * 0.8 || 1 : 0;

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

  return (
    <WModal
      mobileSelectedPage={mobileSelectedPage}
      onMobileSelectedPageChange={setMobileSelectedPage}
      open={open}
      onClose={onClose}
      pages={[{ icon: <InsightsIcon sx={{ fontSize: 18, mt: 0.2 }} />, label: "Prices" }]}
      top={
        <StyledContainer sx={{ flex: 1, p: 1 }}>
          <SelectInput
            items={Object.entries(sellers).map(([url, product]) => ({ label: product.seller, value: url }))}
            value={selectedUrl}
            onChange={setSelectedUrl}
          />
        </StyledContainer>
      }
      rightPages={[{ icon: <EditIcon sx={{ fontSize: 18, mt: 0.1 }} />, label: "Details" }]}
      rightTop={<></>}
      rightBottom={
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
      rightChildren={
        <Stack sx={{ p: 2, gap: 2 }}>
          <StyledContainer sx={{ p: 1 }}>
            <TextInput label="Name" value={newName} onChange={(value) => setNewName(value)} inputSx={{ flex: 1 }} />
          </StyledContainer>
        </Stack>
      }
    >
      <Stack sx={{ flex: 1 }}>
        <Stack sx={{ pt: 2, px: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Price Chart
          </Typography>
        </Stack>
        <Stack sx={{ aspectRatio: "4/1" }}>
          <LineChart
            xAxis={[
              {
                data: prices.map((price) => price.datetime),
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
                data: prices.map((price) => price.price),
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
        </Stack>
        <Divider sx={{ mx: 2 }} />
        <Stack sx={{ p: 2, gap: 2 }}>
          <Stack
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2
            }}
          >
            {prices.length > 0 && <MetaItem title="Number of points" value={String(prices.length)} />}
            {lastUpdatedDate && <MetaItem title="Last Updated" value={lastUpdatedDate} />}
            {lowest && <MetaItem title="Lowest Price" value={`$${lowest.price.toFixed(2)}`} hideDivider />}
            {highest && <MetaItem title="Highest Price" value={`$${highest.price.toFixed(2)}`} hideDivider />}
          </Stack>
        </Stack>
      </Stack>
    </WModal>
  );
};
