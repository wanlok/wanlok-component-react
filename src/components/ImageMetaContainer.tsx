import { Stack } from "@mui/material";
import { ImageMeta } from "../services/Types";
import { MetaItem } from "./MetaItem";

const getGreatestCommonDivisor = (a: number, b: number): number => (b === 0 ? a : getGreatestCommonDivisor(b, a % b));

const getAspectRatio = (width: number, height: number) => {
  if (width === 0 || height === 0) {
    return "";
  }
  const divisor = getGreatestCommonDivisor(width, height);
  return `${width / divisor}:${height / divisor}`;
};

export const ImageMetaContainer = ({ imageMeta }: { imageMeta: ImageMeta | undefined }) => {
  return (
    <Stack
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 2
      }}
    >
      <MetaItem title="Resolution" value={imageMeta ? `${imageMeta.width}x${imageMeta.height}` : undefined} />
      <MetaItem
        title="Aspect Ratio"
        value={imageMeta ? getAspectRatio(imageMeta.width, imageMeta.height) : undefined}
      />
      <MetaItem title="Type" value={imageMeta?.type} hideDivider />
    </Stack>
  );
};
