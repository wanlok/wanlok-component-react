import { ReactNode, useEffect, useRef, useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { groupList } from "../common/ListDictUtils";

export const WCarousel = ({
  list,
  slideKey,
  renderContent
}: {
  list: [string, any][];
  slideKey: (i: number) => string;
  renderContent: (item: any, i: number, j: number) => ReactNode;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState<number>();
  const [dummy, setDummy] = useState(0);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height;
      setHeight(height);
    });
    const element = refs.current[index ?? 0];
    if (element) {
      resizeObserver.observe(element);
    }
    return () => resizeObserver.disconnect();
  }, [index, dummy]);

  return (
    <Carousel
      animation="fade"
      autoPlay={false}
      cycleNavigation={false}
      duration={0}
      height={height}
      indicators={false}
      navButtonsAlwaysVisible={true}
      onChange={(i) => setIndex(i)}
      swipe={false}
    >
      {groupList(list, mobile ? 1 : 4).map((group: [string, any][], i: number) => (
        <Stack
          ref={(element) => {
            refs.current[i] = element;
            if (dummy < list.length) {
              setDummy(dummy + 1);
            }
          }}
          key={slideKey(i)}
          sx={{ flexDirection: "row", gap: "1px" }}
        >
          {group.map((item, j) => renderContent(item, i, j))}
        </Stack>
      ))}
    </Carousel>
  );
};
