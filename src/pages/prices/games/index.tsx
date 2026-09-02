import { useRef, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { bottomSx, layoutHeaderHeight, LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { DeleteConfirmationModal } from "../../../components/DeleteConfirmationModal";
import { EmptyPlaceholder } from "../../../components/EmptyPlaceholder";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { useScrollbarWidths } from "../../../components/useScrollbarWidths";
import { CURRENCY_CODES, CurrencyCode, Game, Platform, PLATFORMS } from "../../../services/ApiTypes";
import { AddGameModal } from "./AddGameModal";
import { DetailsModal } from "./DetailsModal";
import { GamePriceRow } from "./GamePriceRow";
import { useGamePrice } from "./useGamePrice";

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
      <Typography variant="body1">Games</Typography>
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

const PriceHeader = ({ currencyCode }: { currencyCode: CurrencyCode }) => (
  <Stack
    sx={{
      width: layoutHeaderHeight,
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

export const Index = () => {
  const { games, addGame, renameGame, deleteGame } = useGamePrice();
  const gameEntries = PLATFORMS.flatMap((platform) =>
    Object.entries(games[platform])
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, game]) => ({ platform, name, game }))
  );
  const empty = gameEntries.length === 0;
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<{ platform: Platform; name: string; game: Game }>();
  const [controlGroupState, setControlGroupState] = useState(0);
  const effectiveControlGroupState = empty ? 0 : controlGroupState;
  const [gameToDelete, setGameToDelete] = useState<{ platform: Platform; name: string }>();
  const listRef = useRef<HTMLDivElement>(null);
  const scrollbarWidths = useScrollbarWidths(() => listRef.current, [empty]);

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
          <Stack sx={[bottomSx]}>
            {/* <Stack sx={{ flex: 1, px: 2 }}></Stack> */}
            {/* <Stack sx={{ flexDirection: "row", gap: "1px" }}>
              {CURRENCY_CODES.map((currencyCode) => (
                <PriceHeader key={currencyCode} currencyCode={currencyCode} />
              ))}
            </Stack>
            <Stack sx={{ width: 56 + scrollbarWidths.right }} /> */}
          </Stack>
        }
      />
      {empty ? (
        <EmptyPlaceholder text="No games" />
      ) : (
        <Stack ref={listRef} sx={{ flex: 1, overflow: "auto", backgroundColor: "common.white" }}>
          {gameEntries.map(({ platform, name, game }) => (
            <GamePriceRow
              key={`${platform}-${name}`}
              platform={platform}
              name={name}
              game={game}
              deleteMode={effectiveControlGroupState === 1}
              onClick={() => setSelectedGame({ platform, name, game })}
              onDeleteButtonClick={() => setGameToDelete({ platform, name })}
            />
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
        <DetailsModal
          key={`details-modal-${selectedGame.platform}-${selectedGame.name}`}
          open={!!selectedGame}
          onClose={() => setSelectedGame(undefined)}
          name={selectedGame.name}
          game={selectedGame.game}
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
