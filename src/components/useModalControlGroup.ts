import { useEffect, useState } from "react";

export const useModalControlGroup = () => {
  const [isFullScreen, setIsFullScreen] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("isModalFullScreen") === "true"
  );
  const [isDetailsHidden, setIsDetailsHidden] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("isModalDetailsHidden") === "true"
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
    setIsDetailsHidden((current) => {
      const next = !current;
      localStorage.setItem("isModalDetailsHidden", String(next));
      return next;
    });
  };

  return { isFullScreen, onFullScreenClick, exitFullScreen, isDetailsHidden, onDetailsClick };
};
