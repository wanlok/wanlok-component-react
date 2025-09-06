import { useEffect, useRef, useState } from "react";

export default function RufflePlayerComponent({ name }: { name: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [swfPath, setSwfPath] = useState("");
  const [playerCanvas, setPlayerCanvas] = useState<HTMLCanvasElement | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Load Ruffle script only once
    const script = document.createElement("script");
    script.src = "ruffle/ruffle.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  useEffect(() => {
    if (swfPath && window.RufflePlayer?.newest) {
      const ruffle = window.RufflePlayer.newest();
      const player = ruffle.createPlayer();

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(player as unknown as Node);
      }

      player.load(swfPath);

      // Polling function to detect canvas
      const checkCanvas = () => {
        const shadow = (player as any).shadowRoot;
        const canvas = shadow?.querySelector("canvas") as HTMLCanvasElement | null;
        if (canvas) {
          setPlayerCanvas(canvas);
        } else {
          requestAnimationFrame(checkCanvas); // keep checking next frame
        }
      };

      checkCanvas(); // start polling
    }
  }, [swfPath]);

  useEffect(() => {
    if (!playerCanvas) return;

    const cropCanvas = document.createElement("canvas");
    const cropCtx = cropCanvas.getContext("2d");
    if (!cropCtx) return;

    const startX = 0;
    const startY = 0;

    const cropWidth = 536;
    const cropHeight = 40;

    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;

    let lastTime = 0;
    const fps = 30;
    const frameDuration = 1000 / fps;
    let rafId: number;

    const captureFrame = (time: number) => {
      if (time - lastTime >= frameDuration) {
        lastTime = time;

        // Clear previous frame
        cropCtx.clearRect(0, 0, cropWidth, cropHeight);

        // Draw only the cropped portion
        cropCtx.drawImage(
          playerCanvas,
          startX,
          startY, // source x, y
          cropWidth,
          cropHeight, // source width, height
          0,
          0, // destination x, y
          cropWidth,
          cropHeight // destination width, height
        );

        // Update the img element with cropped frame
        if (imgRef.current) {
          imgRef.current.src = cropCanvas.toDataURL("image/png");
        }
      }
      rafId = requestAnimationFrame(captureFrame);
    };

    rafId = requestAnimationFrame(captureFrame);

    return () => cancelAnimationFrame(rafId);
  }, [playerCanvas]);

  return (
    <div>
      <div ref={containerRef}></div>
      <img ref={imgRef} alt="" />
      <button onClick={() => setSwfPath("/" + name)}>Start Game</button>
    </div>
  );
}
