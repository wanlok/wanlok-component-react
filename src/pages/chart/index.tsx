import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { FlashGamePlayer } from "../../components/FlashGamePlayer";
import statusEndImage from "./End.png";

export const Chart = () => {
  const [filePath, setFilePath] = useState<string>("");
  const [score, setScore] = useState<number>(0);

  return (
    <div>
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
          if (newScore > score) {
            console.log("update score", newScore);
            setScore(newScore);
          }
        }}
      />
      {/* <RufflePlayerComponent name={"3dlogicxgen.swf"} /> */}
      {filePath.length === 0 && (
        <Button
          variant="contained"
          onClick={() => {
            setFilePath("yakijuju.swf");
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
      <Typography>{score}</Typography>
    </div>
  );
};
