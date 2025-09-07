import pixelmatch from "pixelmatch";
import { useEffect, useRef, useState } from "react";
import {
  getCanvasAndContext,
  getImageBase64String,
  getImageData,
  loadImageData,
  recognizeText,
  resizeImageData,
  scaleRect
} from "../common/ImageUtils";
import { Rect } from "../services/Types";
import { startAnimationLoop } from "../common/AnimationUtils";

export const FlashGamePlayer = ({
  filePath,
  threshold,
  progressEndImage,
  progressRect,
  scoreRect,
  extractScore,
  onScoreChange
}: {
  filePath: string;
  threshold: number;
  progressEndImage: string;
  progressRect: Rect;
  scoreRect: Rect;
  extractScore: (text: string) => number | undefined;
  onScoreChange: (score: number) => void;
}) => {
  const [playerCanvas, setPlayerCanvas] = useState<HTMLCanvasElement>();
  const [progressEndImageData, setProgressEndImageData] = useState<ImageData>();

  const progressRectRef = useRef(scaleRect(progressRect));
  const scoreRectRef = useRef(scaleRect(scoreRect));

  const divRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<number>(Number.MAX_VALUE);

  const progressImgRef = useRef<HTMLImageElement>(null);
  const resultImgRef = useRef<HTMLImageElement>(null);

  const scoreRef = useRef<number>(0);

  useEffect(() => {
    const load = async () => {
      setProgressEndImageData(await loadImageData(progressEndImage));
    };
    load();
  }, [progressEndImage]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "ruffle/ruffle.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  useEffect(() => {
    if (!filePath || !window.RufflePlayer?.newest) return;

    const player = window.RufflePlayer.newest().createPlayer();

    if (divRef.current) {
      divRef.current.innerHTML = "";
      divRef.current.appendChild(player as unknown as Node);
    }

    player.load(filePath);

    const intervalId = setInterval(() => {
      const shadow = (player as any).shadowRoot;
      const canvas = shadow?.querySelector("canvas") as HTMLCanvasElement | null;
      if (canvas) {
        setPlayerCanvas(canvas);
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [filePath]);

  useEffect(() => {
    if (!playerCanvas || !progressEndImageData) return;

    const { width, height } = progressRectRef.current;
    const { canvas, context } = getCanvasAndContext(width, height);

    const output = new Uint8ClampedArray(progressEndImageData.width * progressEndImageData.height * 4);

    return startAnimationLoop(30, async () => {
      let progressImageData = getImageData(playerCanvas, progressRectRef.current, context);

      if (progressImageData) {
        progressImageData = resizeImageData(progressImageData, progressEndImageData.width, progressEndImageData.height);
      }

      if (progressImageData) {
        const diff = pixelmatch(
          progressImageData.data,
          progressEndImageData.data,
          output,
          progressEndImageData.width,
          progressEndImageData.height
        );

        if (Math.abs(diffRef.current - diff) > threshold) {
          const imageBase64String = getImageBase64String(playerCanvas, scoreRectRef.current);
          if (imageBase64String) {
            const text = await recognizeText(imageBase64String);
            if (text.length > 0) {
              const score = extractScore(text);
              if (score !== undefined && score > scoreRef.current) {
                scoreRef.current = score;
                onScoreChange(score);
              }
            }
            if (resultImgRef.current) {
              resultImgRef.current.src = imageBase64String;
            }
          }
        }

        if (progressImgRef.current) {
          progressImgRef.current.src = canvas.toDataURL("image/png");
        }

        diffRef.current = diff;
      }
    });
  }, [playerCanvas, threshold, progressEndImageData, extractScore, onScoreChange]);

  return (
    <>
      <div ref={divRef}></div>
      {/* <img ref={progressImgRef} alt="" />
      <img alt="" src={progressEndImage} />
      <img ref={resultImgRef} alt="" /> */}
    </>
  );
};
