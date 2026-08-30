import { useState } from "react";
import { ButtonBase, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { Close as CloseIcon } from "@mui/icons-material";
import { DropdownIcon } from "../../../components/DropdownIcon";
import { OneLineTypography } from "../../../components/OneLineTypography";
import { layoutHeaderHeight } from "../../../components/LayoutHeader";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { CURRENCY_CODES, CurrencyCode, GAME_URL_PREFIXES, Game, GamePrice, Platform } from "../../../services/ApiTypes";
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
  const selectedEntry = game[selectedCurrency];
  const selectedPrices = selectedEntry?.prices ?? [];
  const lastUpdatedDate =
    selectedPrices.length > 0 ? selectedPrices[selectedPrices.length - 1].datetime.split("T")[0] : undefined;

  const formatPriceWithDate = (entry: GamePrice | undefined) =>
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
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 2
            }}
          >
            <MetaItem title="Number of data" value={String(selectedPrices.length)} />
            <MetaItem title="Last Updated" value={lastUpdatedDate} />
            <MetaItem title="Lowest Price" value={formatPriceWithDate(selectedEntry?.lowest)} />
            <MetaItem title="Highest Price" value={formatPriceWithDate(selectedEntry?.highest)} />
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
            series={[{ data: selectedPrices.map((price) => price.price), color: palette.text.primary, showMark: true }]}
            height={240}
            margin={{ top: mobile ? 16 : 32, bottom: 0, left: 0, right: 0 }}
            slotProps={{
              axisLine: { style: { stroke: palette.divider, strokeWidth: 1 } },
              axisTick: { style: { stroke: "none" } },
              line: { strokeWidth: 1 },
              mark: { style: { fill: palette.common.white, stroke: palette.common.black } },
              lineHighlight: { fill: palette.common.black }
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
        display: "flex",
        p: 2,
        ...(mobile
          ? {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              backgroundColor: "primary.main"
            }
          : { flex: 1, flexDirection: "column", alignItems: "flex-start", gap: 0.5 })
      }}
    >
      <OneLineTypography variant="body1" sx={{ textAlign: "left" }}>
        {name}
      </OneLineTypography>
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
  const effectiveExpanded = expanded && !deleteMode;

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
              <WButton
                onClick={() => setExpanded(!effectiveExpanded)}
                sx={{ ...controlButtonSx, backgroundColor: effectiveExpanded ? "background.default" : "transparent" }}
              >
                <DropdownIcon panelOpened={effectiveExpanded} sx={{ alignItems: "center", pr: 0 }} />
              </WButton>
            )}
          </Stack>
        </Stack>
      </Stack>
      {effectiveExpanded && <GameDetails game={game} />}
      {!mobile && !effectiveExpanded && <Divider sx={{ ml: 2 }} />}
    </>
  );
};
