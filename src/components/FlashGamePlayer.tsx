import pixelmatch from "pixelmatch";
import { useEffect, useRef, useState } from "react";
import { getImageBase64String, recognizeText, toImageData } from "../common/ImageUtils";
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
  const [playerCanvas, setPlayerCanvas] = useState<HTMLCanvasElement>();
  const [endReferenceImageData, setEndReferenceImageData] = useState<ImageData>();

  const divRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<number>(Number.MAX_VALUE);

  const statusImgRef = useRef<HTMLImageElement>(null);
  const resultImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prepare = async () => {
      setEndReferenceImageData(await toImageData(statusEndImage));
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

    const { x, y, width, height } = statusRect;

    const cropCanvas = document.createElement("canvas");
    const cropCtx = cropCanvas.getContext("2d", { willReadFrequently: true });

    cropCanvas.width = width;
    cropCanvas.height = height;
    if (!cropCtx) return;

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

        cropCtx.drawImage(playerCanvas, x, y, width, height, 0, 0, width, height);

        const imageData = cropCtx.getImageData(0, 0, width, height).data;

        const pixelDiff = pixelmatch(imageData, endReferenceImageData.data, output, width, height);

        if (diffRef.current > pixelDiff && diffRef.current - pixelDiff > 100 && pixelDiff === 0) {
          const imageBase64String = getImageBase64String(playerCanvas, scoreRect);
          if (imageBase64String) {
            if (resultImgRef.current) {
              resultImgRef.current.src = imageBase64String;
            }
            const text = await recognizeText(imageBase64String);
            if (text.length > 0) {
              const score = extractScore(text);
              if (score !== null) {
                onScoreChange(score);
              }
            }
          }
        }

        if (statusImgRef.current) {
          statusImgRef.current.src = cropCanvas.toDataURL("image/png");
        }

        diffRef.current = pixelDiff;
      }

      handle = requestAnimationFrame(captureFrame);
    };

    handle = requestAnimationFrame(captureFrame);

    return () => cancelAnimationFrame(handle);
  }, [playerCanvas, endReferenceImageData, onScoreChange]);

  return (
    <>
      <div ref={divRef}></div>
      {/* <img ref={currentImgRef} alt="" />
      <img alt="" src={endReferenceImage} />
      <img ref={resultImgRef} alt="" /> */}
    </>
  );
};
