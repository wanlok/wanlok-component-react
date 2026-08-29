import { DependencyList, useEffect, useState } from "react";

export const useScrollbarWidths = (
  getElement: () => HTMLElement | null | undefined,
  deps: DependencyList = []
) => {
  const [scrollbarWidths, setScrollbarWidths] = useState({ right: 0, bottom: 0 });

  useEffect(() => {
    const element = getElement();
    if (!element) {
      return;
    }
    const updateScrollbarWidths = () => {
      setScrollbarWidths({
        right: element.offsetWidth - element.clientWidth,
        bottom: element.offsetHeight - element.clientHeight
      });
    };
    updateScrollbarWidths();
    const resizeObserver = new ResizeObserver(updateScrollbarWidths);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps is caller-supplied, re-attaches when the observed element mounts/changes
  }, deps);

  return scrollbarWidths;
};
