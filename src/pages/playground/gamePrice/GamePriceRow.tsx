import { ButtonBase, Divider, Stack, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { DropdownIcon } from "../../../components/DropdownIcon";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { GAME_URL_PREFIXES, Game, Platform } from "../../../services/ApiTypes";

const PriceButton = ({
  platform,
  game,
  currencyCode
}: {
  platform: Platform;
  game: Game;
  currencyCode: "hkd" | "aud";
}) => {
  const entry = game[currencyCode];
  const prices = entry?.prices ?? [];
  const latestPrice = prices[prices.length - 1]?.price;
  const prefix = GAME_URL_PREFIXES[platform][currencyCode];
  const url = entry?.id && prefix ? prefix + (entry.type ? `${entry.type}/` : "") + entry.id : undefined;

  return (
    <ButtonBase
      disabled={!url}
      onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
      sx={{ flexDirection: "column", justifyContent: "center", p: 2, gap: 0.5, width: 100, aspectRatio: "1" }}
    >
      <Typography variant="body1" noWrap>
        {latestPrice !== undefined ? `$${latestPrice.toFixed(2)}` : "-"}
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
  return (
    <Stack sx={{ flexDirection: "row" }}>
      <ButtonBase
        onClick={onClick}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: 2,
          gap: 0.5
        }}
      >
        <Typography variant="body1">{name}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {platform}
        </Typography>
      </ButtonBase>
      <PriceButton platform={platform} game={game} currencyCode="aud" />
      <Divider orientation="vertical" flexItem sx={{ my: 2 }} />
      <PriceButton platform={platform} game={game} currencyCode="hkd" />
      <Stack sx={{ width: 56 }}>
        {deleteMode ? (
          <WButton
            onClick={onDeleteButtonClick}
            sx={{
              ...iconButtonSx,
              height: "100%",
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "action.hover" }
            }}
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </WButton>
        ) : (
          <WButton
            sx={{
              ...iconButtonSx,
              height: "100%",
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "action.hover" }
            }}
          >
            <DropdownIcon panelOpened={false} sx={{ alignItems: "center", pr: 0 }} />
          </WButton>
        )}
      </Stack>
    </Stack>
  );
};
