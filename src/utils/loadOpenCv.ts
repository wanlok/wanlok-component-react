import type { CV } from "@techstark/opencv-js";
import openCvUrl from "@techstark/opencv-js/dist/opencv.js?url";

type OpenCvModule = CV & { onRuntimeInitialized?: () => void };

declare global {
  interface Window {
    cv?: OpenCvModule | Promise<OpenCvModule>;
  }
}

let cvPromise: Promise<CV> | null = null;

// Loaded as a classic <script> tag (opencv.js's UMD "browser globals" fallback) rather than via a
// JS import, so it runs completely outside Rollup's CJS/ESM interop. In production builds, that
// interop layer was producing a wrapper for the module's Promise-based export that structurally
// looked like a Promise but wasn't a genuine native one, breaking native await ("Method
// Promise.prototype.then called on incompatible receiver"). window.cv ends up as the real,
// browser-native Promise the UMD module itself constructs, with nothing bundler-related touching it.
export const loadOpenCv = () => {
  if (!cvPromise) {
    cvPromise = (async () => {
      if (!window.cv) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = openCvUrl;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load OpenCV.js"));
          document.head.appendChild(script);
        });
      }
      const cv = await window.cv!;
      return cv as CV;
    })();
  }
  return cvPromise;
};
