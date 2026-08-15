import type { CV } from "@techstark/opencv-js";

type OpenCvModule = CV & { onRuntimeInitialized?: () => void };

let cvPromise: Promise<CV> | null = null;

export const loadOpenCv = () => {
  if (!cvPromise) {
    cvPromise = (async () => {
      const cvModule = await import("@techstark/opencv-js");
      const maybeCv = (cvModule.default ?? cvModule) as unknown;
      // The default export can itself be thenable, resolving once the WASM runtime is ready, or
      // the (possibly not-yet-initialized) module object directly, depending on load timing. Adopt
      // it manually via its own .then rather than `instanceof Promise` + native await — in
      // production builds this can be a bundler-transformed object that structurally looks like a
      // Promise but isn't a genuine native one, which breaks native await's internal fast path.
      const hasThen =
        maybeCv && typeof maybeCv === "object" && typeof (maybeCv as { then?: unknown }).then === "function";
      if (hasThen) {
        return await new Promise<CV>((resolve, reject) => {
          (maybeCv as { then: (onFulfilled: (v: CV) => void, onRejected: (e: unknown) => void) => void }).then(
            resolve,
            reject
          );
        });
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
