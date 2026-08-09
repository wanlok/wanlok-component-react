import { useState } from "react";

export const useModalControlGroup = () => {
  const [isFullScreen, setIsFullScreen] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("isModalFullScreen") === "true"
  );
  const [isDetailsHidden, setIsDetailsHidden] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("isModalDetailsHidden") === "true"
  );

  const onFullScreenClick = () => {
    setIsFullScreen((current) => {
      const next = !current;
      localStorage.setItem("isModalFullScreen", String(next));
      return next;
    });
  };

  const onDetailsClick = () => {
    setIsDetailsHidden((current) => {
      const next = !current;
      localStorage.setItem("isModalDetailsHidden", String(next));
      return next;
    });
  };

  return { isFullScreen, onFullScreenClick, isDetailsHidden, onDetailsClick };
};
