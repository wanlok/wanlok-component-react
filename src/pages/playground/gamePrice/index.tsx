import { useState } from "react";
import { ButtonBase, Divider, Stack, Typography } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { bottomSx, LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { DeleteConfirmationModal } from "../../../components/DeleteConfirmationModal";
import { EmptyPlaceholder } from "../../../components/EmptyPlaceholder";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { GAME_URL_PREFIXES, Game, Platform, PLATFORMS } from "../../../services/ApiTypes";
import { AddGameModal } from "./AddGameModal";
import { EditGameModal } from "./EditGameModal";
import { useGamePrice } from "./useGamePrice";

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
    <>
      <Divider orientation="vertical" flexItem sx={{ my: 2 }} />
      <ButtonBase
        disabled={!url}
        onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
        sx={{ flexDirection: "column", justifyContent: "center", p: 2, gap: 0.5, width: 100, aspectRatio: "1" }}
      >
        <Typography variant="body1" noWrap>
          {latestPrice !== undefined ? `$${latestPrice.toFixed(2)}` : "-"}
        </Typography>
      </ButtonBase>
    </>
  );
};

const Top = ({
  onAddButtonClick,
  deleteModeActivated,
  onDeleteModeButtonClick
}: {
  onAddButtonClick: () => void;
  deleteModeActivated: boolean;
  onDeleteModeButtonClick: () => void;
}) => (
  <Stack sx={[topSx]}>
    <Stack sx={{ flex: 1, p: 2, justifyContent: "center" }}>
      <Typography variant="body1">Game Price</Typography>
    </Stack>
    <Stack sx={{ flexDirection: "row", gap: "1px" }}>
      <WButton onClick={onAddButtonClick} sx={iconButtonSx}>
        <AddIcon sx={{ fontSize: 26 }} />
      </WButton>
      <WButton isActivated={deleteModeActivated} onClick={onDeleteModeButtonClick} sx={iconButtonSx}>
        <CloseIcon sx={{ fontSize: 24 }} />
      </WButton>
    </Stack>
  </Stack>
);

const PriceHeader = ({ currencyCode }: { currencyCode: "hkd" | "aud" }) => (
  <Stack
    sx={{
      width: 100,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "common.black",
      color: "common.white",
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    }}
  >
    <Typography>{currencyCode.toUpperCase()}</Typography>
  </Stack>
);

const Row = ({
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
      <PriceButton platform={platform} game={game} currencyCode="hkd" />
      <Stack sx={{ width: 56, ml: "1px" }}>
        {deleteMode && (
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
        )}
      </Stack>
    </Stack>
  );
};

export const Index = () => {
  const { games, addGame, renameGame, deleteGame } = useGamePrice();
  const gameEntries = PLATFORMS.flatMap((platform) =>
    Object.entries(games[platform]).map(([name, game]) => ({ platform, name, game }))
  );
  const empty = gameEntries.length === 0;
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<{ platform: Platform; name: string }>();
  const [controlGroupState, setControlGroupState] = useState(0);
  const effectiveControlGroupState = empty ? 0 : controlGroupState;
  const [gameToDelete, setGameToDelete] = useState<{ platform: Platform; name: string }>();

  return (
    <Stack sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
      <LayoutHeader
        top={
          <Top
            onAddButtonClick={() => setAddModalOpen(true)}
            deleteModeActivated={effectiveControlGroupState === 1}
            onDeleteModeButtonClick={() => setControlGroupState(effectiveControlGroupState === 1 ? 0 : 1)}
          />
        }
        bottom={
          <Stack sx={[bottomSx, { gap: "1px" }]}>
            <Stack sx={{ flex: 1, px: 2 }}></Stack>
            <PriceHeader currencyCode="aud" />
            <PriceHeader currencyCode="hkd" />
            <Stack sx={{ width: 56 }} />
          </Stack>
        }
      />
      {empty ? (
        <EmptyPlaceholder text="No games" />
      ) : (
        <Stack sx={{ flex: 1, overflow: "auto", backgroundColor: "common.white" }}>
          {gameEntries.map(({ platform, name, game }, i) => (
            <Stack key={`${platform}-${name}`}>
              {i > 0 && <Divider sx={{ ml: 2 }} />}
              <Row
                platform={platform}
                name={name}
                game={game}
                deleteMode={effectiveControlGroupState === 1}
                onClick={() => setSelectedGame({ platform, name })}
                onDeleteButtonClick={() => setGameToDelete({ platform, name })}
              />
            </Stack>
          ))}
        </Stack>
      )}
      <AddGameModal
        key={`add-game-modal-${addModalOpen ? "open" : "closed"}`}
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSaveButtonClick={addGame}
      />
      {selectedGame && (
        <EditGameModal
          key={`edit-game-modal-${selectedGame.platform}-${selectedGame.name}`}
          open={!!selectedGame}
          onClose={() => setSelectedGame(undefined)}
          name={selectedGame.name}
          onSaveButtonClick={(newName) => renameGame(selectedGame.platform, selectedGame.name, newName)}
        />
      )}
      <DeleteConfirmationModal
        open={!!gameToDelete}
        title="Delete Game"
        name={gameToDelete?.name}
        onClose={() => setGameToDelete(undefined)}
        onConfirm={() => {
          if (gameToDelete) {
            deleteGame(gameToDelete.platform, gameToDelete.name);
            setControlGroupState(0);
          }
        }}
      />
    </Stack>
  );
};
