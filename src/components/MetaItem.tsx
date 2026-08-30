import { Divider, Stack, Typography } from "@mui/material";

export const MetaItem = ({
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
