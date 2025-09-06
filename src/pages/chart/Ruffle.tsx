import { useEffect, useRef, useState } from "react";

export default function RufflePlayerComponent({ name }: { name: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [swfPath, setSwfPath] = useState("");
  const [playerCanvas, setPlayerCanvas] = useState<HTMLCanvasElement | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

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
    if (!swfPath) return;
    if (!window.RufflePlayer?.newest) return;

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
        console.log("Canvas detected!", canvas);
        setPlayerCanvas(canvas);
      } else {
        console.log("HIHI");
        requestAnimationFrame(checkCanvas); // keep checking next frame
      }
    };

    checkCanvas(); // start polling
  }, [swfPath]);

  useEffect(() => {
    if (!playerCanvas) return;

    const handleStream = () => {
      if (videoRef.current && !videoRef.current.srcObject) {
        const stream = playerCanvas.captureStream(30);
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.warn);
      }
    };

    requestAnimationFrame(handleStream);
  }, [playerCanvas]);

  return (
    <div>
      <div ref={containerRef}></div>
      <video ref={videoRef} autoPlay={true} style={{ border: "black solid 1px" }} />
      <button onClick={() => setSwfPath("/" + name)}>Start Game</button>
    </div>
  );
}
