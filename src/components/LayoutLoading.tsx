import { CircularProgress, Stack } from "@mui/material";

export const LayoutLoading = () => (
  <Stack sx={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <CircularProgress sx={{ color: "primary.dark" }} />
  </Stack>
);
