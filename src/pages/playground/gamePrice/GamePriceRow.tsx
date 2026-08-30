import { useState } from "react";
import { ButtonBase, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { Close as CloseIcon } from "@mui/icons-material";
import { DropdownIcon } from "../../../components/DropdownIcon";
import { layoutHeaderHeight } from "../../../components/LayoutHeader";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { CURRENCY_CODES, CurrencyCode, GAME_URL_PREFIXES, Game, Platform } from "../../../services/ApiTypes";
import { StyledContainer } from "../../../components/StyledContainer";
import { SelectInput } from "../../../components/SelectInput";
import { MetaItem } from "../../../components/MetaItem";

const controlButtonSx = {
  ...iconButtonSx,
  height: "100%",
  backgroundColor: "transparent",
  "&:hover": { backgroundColor: "action.hover" }
};

const PriceButton = ({
  platform,
  game,
  currencyCode
}: {
  platform: Platform;
  game: Game;
  currencyCode: "hkd" | "aud";
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const entry = game[currencyCode];
  const prices = entry?.prices ?? [];
  const latestPrice = prices[prices.length - 1]?.price;
  const prefix = GAME_URL_PREFIXES[platform][currencyCode];
  const url = entry?.id && prefix ? prefix + (entry.type ? `${entry.type}/` : "") + entry.id : undefined;

  return (
    <ButtonBase
      disabled={!url}
      onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
      sx={{
        flexDirection: "column",
        justifyContent: "center",
        p: 2,
        gap: 0.5,
        width: layoutHeaderHeight,
        aspectRatio: "1"
      }}
    >
      <Typography variant="body1" noWrap sx={{ color: latestPrice === undefined ? "text.disabled" : undefined }}>
        {latestPrice !== undefined ? `$${latestPrice.toFixed(2)}` : "N/A"}
      </Typography>
      {mobile && <Typography variant="body2">{currencyCode.toUpperCase()}</Typography>}
    </ButtonBase>
  );
};

const GameDetails = ({ game }: { game: Game }) => {
  const { breakpoints, typography, palette } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(CURRENCY_CODES[0]);
  const selectedPrices = game[selectedCurrency]?.prices ?? [];
  const lastUpdatedDate =
    selectedPrices.length > 0 ? selectedPrices[selectedPrices.length - 1].datetime.split("T")[0] : undefined;

  // TODO: temporary client-side min/max; replace once the backend caps price history and exposes all-time lowest/highest directly
  const lowestPriceEntry = selectedPrices.reduce(
    (lowest, price) => (lowest === undefined || price.price <= lowest.price ? price : lowest),
    undefined as (typeof selectedPrices)[number] | undefined
  );
  const highestPriceEntry = selectedPrices.reduce(
    (highest, price) => (highest === undefined || price.price >= highest.price ? price : highest),
    undefined as (typeof selectedPrices)[number] | undefined
  );
  const formatPriceWithDate = (entry: (typeof selectedPrices)[number] | undefined) =>
    entry ? `$${entry.price.toFixed(2)} (${entry.datetime.split("T")[0]})` : undefined;

  return (
    <Stack sx={{ pl: mobile ? 0 : 2 }}>
      <StyledContainer sx={{ p: 1, gap: 1 }}>
        <SelectInput
          items={CURRENCY_CODES.map((currencyCode) => ({ label: currencyCode.toUpperCase(), value: currencyCode }))}
          value={selectedCurrency}
          onChange={(value) => setSelectedCurrency(value as CurrencyCode)}
        />
        <Stack sx={{ p: 2, backgroundColor: "white", border: "1px solid", borderColor: "primary.dark" }}>
          <Stack
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              gap: 2
            }}
          >
            <MetaItem title="Last Updated" value={lastUpdatedDate} />
            <MetaItem title="Lowest Price" value={formatPriceWithDate(lowestPriceEntry)} />
            <MetaItem title="Highest Price" value={formatPriceWithDate(highestPriceEntry)} />
          </Stack>
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
            series={[{ data: selectedPrices.map((price) => price.price), color: palette.text.primary }]}
            height={240}
            margin={{ top: 48, bottom: 32, right: 0, left: 0 }}
            slotProps={{
              axisLine: { style: { stroke: palette.divider, strokeWidth: 1 } },
              axisTick: { style: { stroke: "none" } },
              line: { strokeWidth: 1 }
            }}
          />
        </Stack>
      </StyledContainer>
    </Stack>
  );
};

const GameTitle = ({ name, platform, onClick }: { name: string; platform: Platform; onClick: () => void }) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        flex: mobile ? undefined : 1,
        display: "flex",
        flexDirection: mobile ? "row" : "column",
        alignItems: mobile ? "center" : "flex-start",
        justifyContent: mobile ? "space-between" : undefined,
        p: 2,
        gap: 0.5,
        backgroundColor: mobile ? "primary.main" : undefined
      }}
    >
      <Typography variant="body1" sx={{ textAlign: "left" }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {platform}
      </Typography>
    </ButtonBase>
  );
};

export const GamePriceRow = ({
  platform,
  name,
  game,
  deleteMode,
  onClick,
  onDeleteButtonClick
}: {
  platform: Platform;
  name: string;
  game: Game;
  deleteMode: boolean;
  onClick: () => void;
  onDeleteButtonClick: () => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Stack sx={{ flexDirection: mobile ? "column" : "row" }}>
        <GameTitle name={name} platform={platform} onClick={onClick} />
        <Stack sx={{ flexDirection: "row" }}>
          <PriceButton platform={platform} game={game} currencyCode="aud" />
          <Divider orientation="vertical" flexItem sx={{ my: 2 }} />
          <PriceButton platform={platform} game={game} currencyCode="hkd" />
          <Stack sx={{ width: 56, ml: mobile ? "auto" : 0 }}>
            {deleteMode ? (
              <WButton onClick={onDeleteButtonClick} sx={controlButtonSx}>
                <CloseIcon sx={{ fontSize: 24 }} />
              </WButton>
            ) : (
              <WButton onClick={() => setExpanded(!expanded)} sx={controlButtonSx}>
                <DropdownIcon panelOpened={expanded} sx={{ alignItems: "center", pr: 0 }} />
              </WButton>
            )}
          </Stack>
        </Stack>
      </Stack>
      {expanded && <GameDetails game={game} />}
      {!mobile && !expanded && <Divider sx={{ ml: 2 }} />}
    </>
  );
};
