import { Button, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { FlashGamePlayer } from "../../components/FlashGamePlayer";
import statusEndImage from "./End.png";

export const Chart = () => {
  const [filePath, setFilePath] = useState<string>("");
  const [scores, setScores] = useState<number[]>([]);

  const onScoreChange = useCallback((score: number) => {
    setScores((previousScores) => [...previousScores, score]);
  }, []);

  return (
    <div>
      <FlashGamePlayer
        filePath={filePath}
        statusEndImage={statusEndImage}
        statusRect={{ x: 135, y: 0, width: 180, height: 26 }}
        scoreRect={{ x: 320, y: 0, width: 200, height: 30 }}
        onScoreChange={onScoreChange}
      />
      {/* <RufflePlayerComponent name={"3dlogicxgen.swf"} /> */}
      {filePath.length === 0 && (
        <Button
          variant="contained"
          onClick={() => {
            setFilePath("/yakijuju.swf");
          }}
        >
          Start Game
        </Button>
      )}
      {/* <Button
        variant="contained"
        onClick={() => {
          setSwfPath("/103.swf");
        }}
      >
        Start Game
      </Button> */}

      <Typography variant="h4">Scores</Typography>
      {scores.map((score, i) => {
        return <Typography key={`score-${i}`}>{score}</Typography>;
      })}
    </div>
  );
};
