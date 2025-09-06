import pixelmatch from "pixelmatch";
import { useEffect, useRef, useState } from "react";
import {
  getCanvasAndContext,
  getImageBase64String,
  getImageData,
  loadImageData,
  recognizeText
} from "../common/ImageUtils";
import { Rect } from "../services/Types";

export const FlashGamePlayer = ({
  filePath,
  statusEndImage,
  statusRect,
  scoreRect,
  onScoreChange
}: {
  filePath: string;
  statusEndImage: string;
  statusRect: Rect;
  scoreRect: Rect;
  onScoreChange: (score: number) => void;
}) => {
  const statusRectRef = useRef(statusRect);
  statusRectRef.current = statusRect;

  const scoreRectRef = useRef(scoreRect);
  scoreRectRef.current = scoreRect;

  const [playerCanvas, setPlayerCanvas] = useState<HTMLCanvasElement>();
  const [endReferenceImageData, setEndReferenceImageData] = useState<ImageData>();

  const divRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<number>(Number.MAX_VALUE);

  const statusImgRef = useRef<HTMLImageElement>(null);
  const resultImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prepare = async () => {
      setEndReferenceImageData(await loadImageData(statusEndImage));
    };

    prepare();

    const loadRuffleScript = () => {
      const script = document.createElement("script");
      script.src = "ruffle/ruffle.js";
      script.async = true;
      document.body.appendChild(script);
      return script;
    };

    const script = loadRuffleScript();

    return () => {
      script.remove();
    };
  }, [statusEndImage]);

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
    if (!playerCanvas || !endReferenceImageData) return;

    const { width, height } = statusRectRef.current;
    const { canvas, context } = getCanvasAndContext(width, height);
    const output = new Uint8ClampedArray(width * height * 4);

    let lastTime = 0;
    const fps = 30;
    const frameDuration = 1000 / fps;

    let handle: number;

    const extractScore = (text: string) => {
      const match = text.match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    };

    const captureFrame = async (time: number) => {
      if (time - lastTime >= frameDuration) {
        lastTime = time;

        const imageData = getImageData(playerCanvas, statusRectRef.current, context);

        if (imageData) {
          const diff = pixelmatch(imageData.data, endReferenceImageData.data, output, width, height);

          if (diffRef.current > diff && diffRef.current - diff > 100 && diff === 0) {
            const imageBase64String = getImageBase64String(playerCanvas, scoreRectRef.current);
            if (imageBase64String) {
              const text = await recognizeText(imageBase64String);
              if (text.length > 0) {
                const score = extractScore(text);
                if (score !== null) {
                  onScoreChange(score);
                }
              }
              if (resultImgRef.current) {
                resultImgRef.current.src = imageBase64String;
              }
            }
          }

          if (statusImgRef.current) {
            statusImgRef.current.src = canvas.toDataURL("image/png");
          }

          diffRef.current = diff;
        }
      }

      handle = requestAnimationFrame(captureFrame);
    };

    handle = requestAnimationFrame(captureFrame);

    return () => cancelAnimationFrame(handle);
  }, [playerCanvas, endReferenceImageData, onScoreChange]);

  return (
    <>
      <div ref={divRef}></div>
      {/* <img ref={statusImgRef} alt="" />
      <img alt="" src={statusEndImage} />
      <img ref={resultImgRef} alt="" /> */}
    </>
  );
};
