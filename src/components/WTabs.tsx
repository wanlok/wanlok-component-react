import { ReactElement, useLayoutEffect, useRef, useState } from "react";
import { Tab, Tabs } from "@mui/material";

export type TabItem = {
  icon?: ReactElement;
  label: string;
};

export const WTabs = ({
  value,
  tabs,
  onChange
}: {
  value: number;
  tabs: TabItem[];
  onChange: (value: number) => void;
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"scrollable" | "fullWidth">("scrollable");

  useLayoutEffect(() => {
    if (variant !== "scrollable") {
      return;
    }
    const element = tabsRef.current;
    if (!element) {
      return;
    }
    const scroller = element.querySelector(".MuiTabs-scroller") as HTMLElement | null;
    if (!scroller) {
      return;
    }
    setVariant(scroller.scrollWidth <= scroller.clientWidth ? "fullWidth" : "scrollable");
  }, [variant]);

  return (
    <Tabs
      ref={tabsRef}
      value={value}
      variant={variant}
      scrollButtons={false}
      onChange={(_, newValue) => onChange(newValue)}
      sx={{
        flex: 1,
        pointerEvents: tabs.length > 1 ? undefined : "none",
        "& .MuiTab-root": {
          p: 2,
          color: "text.primary",
          textTransform: "none",
          letterSpacing: "normal",
          height: 56,
          minHeight: 56,
          fontSize: 16,
          justifyContent: "flex-start",
          overflow: "visible"
        },
        "& .MuiTab-root.Mui-selected": {
          color: "text.primary"
        },
        "& .MuiTabs-indicator": {
          backgroundColor: "common.black",
          height: 2,
          display: tabs.length > 1 ? undefined : "none"
        }
      }}
    >
      {tabs.map(({ icon, label }, i) => (
        <Tab key={i} icon={icon} iconPosition="start" label={label} />
      ))}
    </Tabs>
  );
};
