import { Stack, Typography } from "@mui/material";

export const ImageMeta = ({ width, height, type }: { width: number; height: number; type: string }) => {
  return (
    <Stack>
      <Typography>{`${width} x ${height}`}</Typography>
      <Typography>{type}</Typography>
    </Stack>
  );
};
