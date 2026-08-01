import { ApiResponse } from "./Types";

export const fetchCollection = <T,>(id: string, signal?: AbortSignal): Promise<ApiResponse<T>> => {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.left = "-9999px";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    let observer: MutationObserver | undefined;

    const cleanup = () => {
      iframe.removeEventListener("load", onLoad);
      observer?.disconnect();
      iframe.remove();
    };

    const captureContent = () => {
      const root = iframe.contentDocument?.getElementById("root");
      if (!root) {
        return;
      }
      try {
        const response = JSON.parse(root.textContent ?? "") as ApiResponse<T>;
        if (response.status !== "ok") {
          // Firestore fetch inside the iframe has not resolved yet.
          return;
        }
        resolve(response);
        cleanup();
      } catch {
        // Firestore fetch inside the iframe hasn't resolved into JSON yet.
      }
    };

    const onLoad = () => {
      const root = iframe.contentDocument?.getElementById("root");
      if (!root) {
        return;
      }
      observer = new MutationObserver(captureContent);
      observer.observe(root, { childList: true, characterData: true, subtree: true });
    };

    signal?.addEventListener("abort", () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    });

    iframe.addEventListener("load", onLoad);
    iframe.src = `${window.location.origin}${window.location.pathname}#/api/collections/${id}`;
  });
};
