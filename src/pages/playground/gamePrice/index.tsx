import { useState } from "react";
import { Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { bottomSx, LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { DeleteConfirmationModal } from "../../../components/DeleteConfirmationModal";
import { EmptyPlaceholder } from "../../../components/EmptyPlaceholder";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { Platform, PLATFORMS } from "../../../services/ApiTypes";
import { AddGameModal } from "./AddGameModal";
import { EditGameModal } from "./EditGameModal";
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

export const Index = () => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
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
          <Stack sx={[bottomSx]}>
            <Stack sx={{ flex: 1, px: 2 }}></Stack>
            <Stack sx={{ flexDirection: "row", gap: "1px" }}>
              <PriceHeader currencyCode="aud" />
              <PriceHeader currencyCode="hkd" />
            </Stack>
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
              {i > 0 && !mobile && <Divider sx={{ ml: 2 }} />}
              <GamePriceRow
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
