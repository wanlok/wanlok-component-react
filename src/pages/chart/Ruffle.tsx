import { useEffect, useRef, useState } from "react";

export default function RufflePlayerComponent({ name }: { name: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [swfPath, setSwfPath] = useState("");

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

    if (window.RufflePlayer?.newest) {
      const ruffle = window.RufflePlayer.newest();
      const player = ruffle.createPlayer();

      // Clear old player if exists
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(player as unknown as Node);
      }

      // @ts-ignore
      player.load(swfPath);
    } else {
      console.error("RufflePlayer not found on window");
    }
  }, [swfPath]);

  return (
    <div>
      <div ref={containerRef}></div>
      <button onClick={() => setSwfPath("/" + name)}>Start Game</button>
    </div>
  );
}
