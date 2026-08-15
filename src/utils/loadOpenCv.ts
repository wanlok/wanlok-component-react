import type { CV } from "@techstark/opencv-js";

type OpenCvModule = CV & { onRuntimeInitialized?: () => void };

let cvPromise: Promise<CV> | null = null;

export const loadOpenCv = () => {
  if (!cvPromise) {
    cvPromise = (async () => {
      const cvModule = await import("@techstark/opencv-js");
      const maybeCv = (cvModule.default ?? cvModule) as unknown;
      // The default export can itself be a Promise that resolves once the WASM runtime is ready,
      // or the (possibly not-yet-initialized) module object directly, depending on load timing.
      if (maybeCv instanceof Promise) {
        return (await maybeCv) as CV;
      }
      const cv = maybeCv as OpenCvModule;
      if (!cv.Mat) {
        await new Promise<void>((resolve) => {
          cv.onRuntimeInitialized = () => resolve();
        });
      }
      return cv as CV;
    })();
  }
  return cvPromise;
};
