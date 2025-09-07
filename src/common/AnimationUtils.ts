export const startAnimationLoop = (framePerSecond: number, callback: () => Promise<void>) => {
  let handle: number;
  let lastTime = 0;
  let running = false;
  const frameDuration = 1000 / framePerSecond;
  const loop = async (time: number) => {
    if (!running && time - lastTime >= frameDuration) {
      lastTime = time;
      running = true;
      try {
        await callback();
      } catch (e) {}
      running = false;
    }
    handle = requestAnimationFrame(loop);
  };
  handle = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(handle);
};
