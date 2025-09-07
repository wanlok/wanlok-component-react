export const startAnimationLoop = (fps: number, callback: () => Promise<void>) => {
  let handle: number;
  let lastTime = performance.now();
  let running = false;
  const frameDuration = 1000 / fps;

  const loop = async (time: number) => {
    const delta = time - lastTime;

    if (!running && delta >= frameDuration) {
      lastTime = time;
      running = true;
      try {
        await callback();
      } finally {
        running = false;
      }
    }

    handle = requestAnimationFrame(loop);
  };

  handle = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(handle);
};
