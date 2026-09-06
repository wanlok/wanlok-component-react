import { CircularProgress, Divider, Stack, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useState } from "react";
import { Edit as EditIcon, Insights as InsightsIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { StyledContainer } from "../../components/StyledContainer";
import { TextInput } from "../../components/TextInput";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";
import { SelectInput } from "../../components/SelectInput";
import { MetaItem } from "../../components/MetaItem";
import { iconButtonSx, WButton } from "../../components/WButton";
import { Product, ProductType } from "../../services/ApiTypes";
import { useProductModal } from "./useProductModal";

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
  const [mobileSelectedPage, setMobileSelectedPage] = useState(0);
  const {
    newName,
    onNewNameChange,
    selectedUrl,
    onSelectedUrlChange,
    isUpdatingPrice,
    prices,
    lastUpdatedDate,
    lowest,
    highest,
    minPrice,
    maxPrice,
    pricePadding,
    onSaveButtonClick,
    onUpdatePriceButtonClick
  } = useProductModal({ type, name, sellers });

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
            onChange={onSelectedUrlChange}
          />
        </StyledContainer>
      }
      rightPages={[{ icon: <EditIcon sx={{ fontSize: 18, mt: 0.1 }} />, label: "Details" }]}
      rightTop={
        <WButton disabled={isUpdatingPrice} onClick={onUpdatePriceButtonClick} sx={iconButtonSx}>
          {isUpdatingPrice ? (
            <CircularProgress size={16} sx={{ color: "text.primary" }} />
          ) : (
            <RefreshIcon sx={{ fontSize: 24 }} />
          )}
        </WButton>
      }
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
            <TextInput label="Name" value={newName} onChange={onNewNameChange} inputSx={{ flex: 1 }} />
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
            <MetaItem title="Number of points" value={String(prices.length)} />
            <MetaItem title="Last Updated" value={lastUpdatedDate} />
            <MetaItem title="Lowest Price" value={lowest ? `$${lowest.price.toFixed(2)}` : undefined} hideDivider />
            <MetaItem title="Highest Price" value={highest ? `$${highest.price.toFixed(2)}` : undefined} hideDivider />
          </Stack>
        </Stack>
      </Stack>
    </WModal>
  );
};
