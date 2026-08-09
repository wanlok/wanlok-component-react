import { Divider, Stack, Typography } from "@mui/material";
import { ImageMeta } from "../services/Types";

const getGreatestCommonDivisor = (a: number, b: number): number => (b === 0 ? a : getGreatestCommonDivisor(b, a % b));

const getAspectRatio = (width: number, height: number) => {
  if (width === 0 || height === 0) {
    return "";
  }
  const divisor = getGreatestCommonDivisor(width, height);
  return `${width / divisor}:${height / divisor}`;
};

const Item = ({
  title,
  value,
  hideDivider = false
}: {
  title: string;
  value: string | undefined;
  hideDivider?: boolean;
}) => {
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {title}
        </Typography>
        {value === undefined ? <Stack sx={{ height: 24 }} /> : <Typography variant="body1">{value}</Typography>}
      </Stack>
      {!hideDivider && <Divider />}
    </Stack>
  );
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
      <Item title="Resolution" value={imageMeta ? `${imageMeta.width}x${imageMeta.height}` : undefined} />
      <Item title="Aspect Ratio" value={imageMeta ? getAspectRatio(imageMeta.width, imageMeta.height) : undefined} />
      <Item title="Type" value={imageMeta?.type} hideDivider />
    </Stack>
  );
};
