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

export const FlashGamePlayer = ({
  filePath,
  threshold,
  statusEndImage,
  statusRect,
  scoreRect,
  onScoreChange
}: {
  filePath: string;
  threshold: number;
  statusEndImage: string;
  statusRect: Rect;
  scoreRect: Rect;
  onScoreChange: (score: number) => void;
}) => {
  const [playerCanvas, setPlayerCanvas] = useState<HTMLCanvasElement>();
  const [statusEndImageData, setStatusEndImageData] = useState<ImageData>();

  const statusRectRef = useRef(scaleRect(statusRect));
  const scoreRectRef = useRef(scaleRect(scoreRect));

  const divRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<number>(Number.MAX_VALUE);

  const statusImgRef = useRef<HTMLImageElement>(null);
  const resultImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const load = async () => {
      setStatusEndImageData(await loadImageData(statusEndImage));
    };
    load();
  }, [statusEndImage]);

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
    if (!playerCanvas || !statusEndImageData) return;

    const { width, height } = statusRectRef.current;
    const { canvas, context } = getCanvasAndContext(width, height);
    const output = new Uint8ClampedArray(statusEndImageData.width * statusEndImageData.height * 4);

    let lastTime = 0;
    const fps = 30;
    const frameDuration = 1000 / fps;

    let handle: number;

    const extractScore = (text: string) => {
      return parseInt(text.toLowerCase().replace("score:", "").replace("sc0re:", "").replace(/o/g, "0").trim());
    };

    const captureFrame = async (time: number) => {
      if (time - lastTime >= frameDuration) {
        lastTime = time;

        let imageData = getImageData(playerCanvas, statusRectRef.current, context);
        if (imageData) {
          imageData = resizeImageData(imageData, statusEndImageData.width, statusEndImageData.height);
        }
        if (imageData) {
          const diff = pixelmatch(
            imageData.data,
            statusEndImageData.data,
            output,
            statusEndImageData.width,
            statusEndImageData.height
          );

          if (diffRef.current > diff && diffRef.current - diff > threshold && diff < threshold) {
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
  }, [playerCanvas, statusEndImageData, onScoreChange]);

  return (
    <>
      <div ref={divRef}></div>
      {/* <img ref={statusImgRef} alt="" />
      <img alt="" src={statusEndImage} />
      <img ref={resultImgRef} alt="" /> */}
    </>
  );
};
