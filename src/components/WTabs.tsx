import { ReactElement } from "react";
import { Divider, Stack, Tab, Tabs } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { iconButtonSx, WButton } from "./WButton";

export type TabItem = {
  icon?: ReactElement;
  label: string;
};

export const WTabs = ({
  value,
  tabs,
  onChange,
  onClose
}: {
  value: number;
  tabs: TabItem[];
  onChange: (value: number) => void;
  onClose?: () => void;
}) => (
  <Stack sx={{ flexDirection: "row", alignItems: "center", backgroundColor: "common.white" }}>
    <Tabs
      value={value}
      variant="fullWidth"
      onChange={(_, newValue) => onChange(newValue)}
      sx={{
        flex: 1,
        pointerEvents: tabs.length === 1 ? "none" : undefined,
        "& .MuiTab-root": {
          p: 2,
          backgroundColor: "common.white",
          color: "text.primary",
          textTransform: "none",
          letterSpacing: "normal",
          minHeight: 56,
          fontSize: 16,
          justifyContent: "flex-start"
        },
        "& .MuiTab-root.Mui-selected": {
          backgroundColor: "background.default",
          color: "text.primary"
        },
        "& .MuiTabs-indicator": { display: "none" }
      }}
    >
      {tabs.map(({ icon, label }, i) => (
        <Tab key={i} icon={icon} iconPosition="start" label={label} />
      ))}
    </Tabs>
    {onClose && (
      <>
        <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
        <WButton onClick={onClose} sx={{ ...iconButtonSx, backgroundColor: "transparent" }}>
          <CloseIcon sx={{ fontSize: 24 }} />
        </WButton>
      </>
    )}
  </Stack>
);
