import pixelmatch from "pixelmatch";
import { useEffect, useRef, useState } from "react";
import { getImageBase64String, recognizeText, toImageData } from "../common/ImageUtils";

export const FlashGamePlayer = ({
  filePath,
  endReferenceImage,
  onScoreChange
}: {
  filePath: string;
  endReferenceImage: string;
  onScoreChange: (score: number) => void;
}) => {
  const [playerCanvas, setPlayerCanvas] = useState<HTMLCanvasElement>();
  const [endReferenceImageData, setEndReferenceImageData] = useState<ImageData>();

  const playerRef = useRef<HTMLDivElement>(null);
  const currentImgRef = useRef<HTMLImageElement>(null);
  const resultImgRef = useRef<HTMLImageElement>(null);
  const pixelDiffRef = useRef<number>(Number.MAX_VALUE);

  const startX = 135;
  const startY = 0;
  const cropWidth = 180;
  const cropHeight = 26;

  // Load Ruffle script once
  useEffect(() => {
    const prepare = async () => {
      setEndReferenceImageData(await toImageData(endReferenceImage));
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
  }, [endReferenceImage]);

  useEffect(() => {
    if (!filePath || !window.RufflePlayer?.newest) return;

    const player = window.RufflePlayer.newest().createPlayer();

    if (playerRef.current) {
      playerRef.current.innerHTML = "";
      playerRef.current.appendChild(player as unknown as Node);
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

    const cropCanvas = document.createElement("canvas");
    const cropCtx = cropCanvas.getContext("2d", { willReadFrequently: true });

    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;
    if (!cropCtx) return;

    const output = new Uint8ClampedArray(cropWidth * cropHeight * 4);

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

        cropCtx.drawImage(playerCanvas, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        const imageData = cropCtx.getImageData(0, 0, cropWidth, cropHeight).data;

        const pixelDiff = pixelmatch(imageData, endReferenceImageData.data, output, cropWidth, cropHeight);

        if (pixelDiffRef.current > pixelDiff && pixelDiffRef.current - pixelDiff > 100 && pixelDiff === 0) {
          const imageBase64String = getImageBase64String(playerCanvas, 320, 0, 200, 30);
          if (imageBase64String) {
            if (resultImgRef.current) {
              resultImgRef.current.src = imageBase64String;
            }
            const text = await recognizeText(imageBase64String);
            if (text.length > 0) {
              const score = extractScore(text);
              if (score) {
                onScoreChange(score);
              }
            }
          }
        }

        if (currentImgRef.current) {
          currentImgRef.current.src = cropCanvas.toDataURL("image/png");
        }

        pixelDiffRef.current = pixelDiff;
      }

      handle = requestAnimationFrame(captureFrame);
    };

    handle = requestAnimationFrame(captureFrame);

    return () => cancelAnimationFrame(handle);
  }, [playerCanvas, endReferenceImageData, onScoreChange]);

  return (
    <>
      <div ref={playerRef}></div>
      {/* <img ref={currentImgRef} alt="" />
      <img alt="" src={endReferenceImage} />
      <img ref={resultImgRef} alt="" /> */}
    </>
  );
};
