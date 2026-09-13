import { ReactNode } from "react";
import { Divider, Stack, Tooltip, Typography } from "@mui/material";

export const MetaItem = ({
  title,
  value,
  tooltip,
  hideDivider = false
}: {
  title: string;
  value: string | undefined;
  tooltip?: ReactNode;
  hideDivider?: boolean;
}) => {
  const valueTypography =
    value === undefined ? (
      <Typography variant="body1" sx={{ width: "fit-content", color: "text.disabled" }}>
        N/A
      </Typography>
    ) : (
      <Typography variant="body1" sx={{ width: "fit-content" }}>
        {value}
      </Typography>
    );
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {title}
        </Typography>
        {tooltip ? (
          <Tooltip title={tooltip} arrow slotProps={{ tooltip: { sx: { maxWidth: "none" } } }}>
            {valueTypography}
          </Tooltip>
        ) : (
          valueTypography
        )}
      </Stack>
      {!hideDivider && <Divider />}
    </Stack>
  );
};
