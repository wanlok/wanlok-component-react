import pixelmatch from "pixelmatch";
import { useEffect, useRef, useState } from "react";
import { toImageData } from "../../common/ImageUtils";

export const FlashPlayer = ({
  filePath,
  endReferenceImage,
  onChange
}: {
  filePath: string;
  endReferenceImage: string;
  onChange: (imageBase64String: string) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerCanvas, setPlayerCanvas] = useState<HTMLCanvasElement | null>(null);
  const [endReferenceImageData, setEndReferenceImageData] = useState<ImageData>();

  const imgRef = useRef<HTMLImageElement | null>(null);

  const previousPixelDiffRef = useRef<number>(Number.MAX_VALUE);

  const startX = 135;
  const startY = 0;
  const cropWidth = 180;
  const cropHeight = 26;

  const output = new Uint8ClampedArray(cropWidth * cropHeight * 4);

  const prepare = async () => {
    setEndReferenceImageData(await toImageData(endReferenceImage));
  };

  const loadRuffleScript = () => {
    const script = document.createElement("script");
    script.src = "ruffle/ruffle.js";
    script.async = true;
    document.body.appendChild(script);
    return script;
  };

  // Load Ruffle script once
  useEffect(() => {
    prepare();
    const script = loadRuffleScript();
    return () => {
      script.remove();
    };
  }, [prepare]);

  // Initialize Ruffle player
  useEffect(() => {
    if (!filePath || !window.RufflePlayer?.newest) return;

    const ruffle = window.RufflePlayer.newest();
    const player = ruffle.createPlayer();

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(player as unknown as Node);
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
    if (!cropCtx) return;

    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;

    let lastTime = 0;
    const fps = 30;
    const frameDuration = 1000 / fps;
    let rafId: number;

    const captureFrame = (time: number) => {
      if (time - lastTime >= frameDuration) {
        lastTime = time;

        cropCtx.drawImage(playerCanvas, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        const imageData = cropCtx.getImageData(0, 0, cropWidth, cropHeight).data;

        const pixelDiff = pixelmatch(imageData, endReferenceImageData.data, output, cropWidth, cropHeight);

        if (Math.abs(pixelDiff - previousPixelDiffRef.current) > 100) {
          onChange(playerCanvas.toDataURL("image/png"));
        }

        if (imgRef.current) {
          imgRef.current.src = cropCanvas.toDataURL("image/png");
        }

        previousPixelDiffRef.current = pixelDiff;
      }
      rafId = requestAnimationFrame(captureFrame);
    };

    rafId = requestAnimationFrame(captureFrame);

    return () => cancelAnimationFrame(rafId);
  }, [playerCanvas]);

  return (
    <div>
      <div ref={containerRef}></div>
      {/* <img ref={imgRef} alt="" />
      <img alt="" src={endReferenceImage} /> */}
    </div>
  );
};
