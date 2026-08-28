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
  const prices = game[currencyCode]?.prices ?? [];
  const latestPrice = prices[prices.length - 1]?.price;
  const id = game[currencyCode]?.id;
  const prefix = GAME_URL_PREFIXES[platform][currencyCode];
  const url = id && prefix ? prefix + id : undefined;

  return (
    <ButtonBase
      disabled={!url}
      onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
      sx={{ flexDirection: "column", aspectRatio: "1", p: 2, gap: 0.5 }}
    >
      <Typography variant="body1">{latestPrice !== undefined ? `$${latestPrice.toFixed(2)}` : "-"}</Typography>
    </ButtonBase>
  );
};

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
      <PriceButton platform={platform} game={game} currencyCode="hkd" />
      <PriceButton platform={platform} game={game} currencyCode="aud" />
      {deleteMode && (
        <WButton
          onClick={onDeleteButtonClick}
          sx={{ ...iconButtonSx, backgroundColor: "transparent", "&:hover": { backgroundColor: "action.hover" } }}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </WButton>
      )}
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
          <Stack sx={[topSx]}>
            <Stack sx={{ flex: 1, p: 2, justifyContent: "center" }}>
              <Typography variant="body1">Game Price</Typography>
            </Stack>
            <Stack sx={{ flexDirection: "row", gap: "1px" }}>
              <WButton onClick={() => setAddModalOpen(true)} sx={iconButtonSx}>
                <AddIcon sx={{ fontSize: 26 }} />
              </WButton>
              <WButton
                isActivated={effectiveControlGroupState === 1}
                onClick={() => setControlGroupState(effectiveControlGroupState === 1 ? 0 : 1)}
                sx={iconButtonSx}
              >
                <CloseIcon sx={{ fontSize: 24 }} />
              </WButton>
            </Stack>
          </Stack>
        }
        bottom={<Stack sx={[bottomSx]} />}
      />
      {empty ? (
        <EmptyPlaceholder text="No games" />
      ) : (
        <Stack sx={{ flex: 1, overflow: "auto", backgroundColor: "common.white" }}>
          {gameEntries.map(({ platform, name, game }, i) => (
            <Stack key={`${platform}-${name}`}>
              {i > 0 && <Divider />}
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
