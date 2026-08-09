import { useEffect, useState } from "react";

export const useModalControlGroup = () => {
  const [isFullScreen, setIsFullScreen] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("isModalFullScreen") === "true"
  );
  const [isRightHidden, setIsRightHidden] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("isModalRightHidden") === "true"
  );

  useEffect(() => {
    const onFullscreenChange = () => {
      const next = document.fullscreenElement !== null;
      setIsFullScreen(next);
      localStorage.setItem("isModalFullScreen", String(next));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const onFullScreenClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const onDetailsClick = () => {
    setIsRightHidden((current) => {
      const next = !current;
      localStorage.setItem("isModalRightHidden", String(next));
      return next;
    });
  };

  return { isFullScreen, onFullScreenClick, exitFullScreen, isRightHidden, onDetailsClick };
};
