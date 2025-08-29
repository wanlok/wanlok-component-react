import { ReactNode, useEffect, useRef, useState } from "react";
import { alpha, Box, Stack, SxProps, Theme, useTheme } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { groupList } from "../common/ListDictUtils";
import LeftWhiteIcon from "../assets/images/icons/left_white.png";
import RightWhiteIcon from "../assets/images/icons/right_white.png";

export const WCarousel = ({
  list,
  numberOfComponentsPerSlide,
  slideKey,
  renderContent,
  sx
}: {
  list: any[];
  numberOfComponentsPerSlide: number;
  slideKey: (i: number) => string;
  renderContent: (item: any, i: number, j: number) => ReactNode;
  sx?: SxProps<Theme>;
}) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState<number>();
  const [height, setHeight] = useState<number>();
  const { palette } = useTheme();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    const element = refs.current[index ?? 0];
    if (element) {
      resizeObserver.observe(element);
    }
    return () => resizeObserver.disconnect();
  }, [list, index]);

  return list.length > 0 ? (
    <Carousel
      animation="fade"
      autoPlay={false}
      cycleNavigation={false}
      duration={0}
      height={height}
      indicators={false}
      PrevIcon={<Box component="img" src={LeftWhiteIcon} alt="" sx={{ width: 16, height: 16 }} />}
      NextIcon={<Box component="img" src={RightWhiteIcon} alt="" sx={{ width: 16, height: 16 }} />}
      navButtonsProps={{
        style: {
          backgroundColor: alpha(palette.common.black, 0.6),
          borderRadius: 0,
          width: 48,
          height: 48,
          marginTop: -4,
          marginLeft: 0,
          marginRight: 0
        }
      }}
      navButtonsWrapperProps={{
        style: {
          top: "50%",
          transform: "translateY(-50%)",
          right: 1,
          width: 48,
          height: 48
        }
      }}
      navButtonsAlwaysVisible={true}
      onChange={(i) => setIndex(i)}
      swipe={false}
      sx={{ ...sx }}
    >
      {groupList(list, numberOfComponentsPerSlide).map((group: any[], i: number) => {
        return (
          <Stack
            ref={(element) => {
              refs.current[i] = element;
            }}
            key={slideKey(i)}
            sx={{ flexDirection: "row", gap: "1px" }}
          >
            {group.map((item, j) => renderContent(item, i, j))}
          </Stack>
        );
      })}
    </Carousel>
  ) : (
    <></>
  );
};
