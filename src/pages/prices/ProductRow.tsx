import { ButtonBase, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { OneLineTypography } from "../../../components/OneLineTypography";
import { layoutHeaderHeight } from "../../../components/LayoutHeader";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { CURRENCY_CODES, CurrencyCode, GAME_URL_PREFIXES, Game, Platform } from "../../../services/ApiTypes";

const PriceButton = ({
  platform,
  game,
  currencyCode
}: {
  platform: Platform;
  game: Game;
  currencyCode: CurrencyCode;
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

  return (
    <>
      <Stack sx={{ flexDirection: mobile ? "column" : "row" }}>
        <GameTitle name={name} platform={platform} onClick={onClick} />
        <Stack sx={{ flexDirection: "row", minWidth: 0 }}>
          <Stack sx={{ flexDirection: "row", overflowX: "auto", minWidth: 0 }}>
            {CURRENCY_CODES.map((currencyCode, i) => (
              <Stack key={currencyCode} sx={{ flexDirection: "row", flexShrink: 0 }}>
                {i > 0 && <Divider orientation="vertical" flexItem sx={{ my: 2 }} />}
                <PriceButton platform={platform} game={game} currencyCode={currencyCode} />
              </Stack>
            ))}
          </Stack>
          <Stack>
            {deleteMode && (
              <WButton
                onClick={onDeleteButtonClick}
                sx={{ ...iconButtonSx, backgroundColor: "transparent", "&:hover": { backgroundColor: "action.hover" } }}
              >
                <CloseIcon sx={{ fontSize: 24 }} />
              </WButton>
            )}
          </Stack>
        </Stack>
      </Stack>
      {!mobile && <Divider sx={{ ml: 2 }} />}
    </>
  );
};
