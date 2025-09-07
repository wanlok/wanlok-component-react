export const startAnimationLoop = (framePerSecond: number, callback: () => void) => {
  let handle: number;
  let lastTime = 0;
  const frameDuration = 1000 / framePerSecond;
  const loop = (time: number) => {
    if (time - lastTime >= frameDuration) {
      lastTime = time;
      callback();
    }
    handle = requestAnimationFrame(loop);
  };
  handle = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(handle);
};
