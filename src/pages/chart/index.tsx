import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import { FlashGamePlayer } from "../../components/FlashGamePlayer";
import endImage from "./End.png";

export const Chart = () => {
  const [swfFilePath, setSwfFilePath] = useState<string>("");

  const onScoreChange = useCallback((score: number) => {
    console.log(score);
  }, []);

  return (
    <div>
      <FlashGamePlayer filePath={swfFilePath} endReferenceImage={endImage} onScoreChange={onScoreChange} />
      {/* <RufflePlayerComponent name={"3dlogicxgen.swf"} /> */}
      <Button
        variant="contained"
        onClick={() => {
          setSwfFilePath("/yakijuju.swf");
        }}
      >
        Start Game
      </Button>
      {/* <Button
        variant="contained"
        onClick={() => {
          setSwfPath("/103.swf");
        }}
      >
        Start Game
      </Button> */}
    </div>
  );
};
