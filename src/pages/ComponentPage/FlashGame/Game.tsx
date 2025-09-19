import { useRef } from "react";
import { useGame } from "../useGame";
import { Stack, Typography } from "@mui/material";
import { TextInputForm } from "../../../components/TextInputForm";
import { FlashGamePlayer } from "../../../components/FlashGamePlayer";

import statusEndImage from "./End.png";

export const Game = () => {
  const { name, filePath, scores, startGame, addScore } = useGame();

  const scoreRef = useRef(0);

  return (
    <Stack>
      {!name && (
        <TextInputForm
          placeholder="Name"
          rightButtons={[
            {
              label: "Start Game",
              onClickWithText: (text) => {
                startGame(text);
              }
            }
          ]}
        />
      )}
      <Typography>{name}</Typography>
      <FlashGamePlayer
        filePath={filePath}
        threshold={100}
        progressEndImage={statusEndImage}
        progressRect={{ x: 135, y: 0, width: 180, height: 26 }}
        scoreRect={{ x: 320, y: 0, width: 200, height: 30 }}
        extractScore={(text: string) => {
          const score = parseInt(
            text.toLowerCase().replace("score:", "").replace("sc0re:", "").replace(/o/g, "0").trim()
          );
          return isNaN(score) ? undefined : score;
        }}
        onScoreChange={(newScore) => {
          if (newScore > scoreRef.current) {
            console.log("update score", scoreRef.current, newScore);
            addScore(newScore);
            scoreRef.current = newScore;
          }
        }}
      />
      <Typography variant="h4">Scoreboard</Typography>
      {Object.entries(scores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .map(([name, score], index) => (
          <Typography key={`scoreboard-${index}`}>
            {name} {score}
          </Typography>
        ))}
    </Stack>
  );
};
