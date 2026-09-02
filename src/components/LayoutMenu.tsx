import { Box, Divider, Stack, useMediaQuery, useTheme } from "@mui/material";
import { Fragment, ReactNode } from "react";
import { WButton } from "./WButton";
import { LayoutDivider } from "./LayoutDivider";
import { layoutHeaderHeight } from "./LayoutHeader";
import { navSections, NavSectionId } from "../configs/navSections";

export const LayoutMenu = ({ activeSection, children }: { activeSection: NavSectionId; children: ReactNode }) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));

  return (
    <Stack sx={{ flexDirection: mobile ? "column" : "row", height: "100dvh" }}>
      <LayoutDivider>
        <Stack sx={{ flexDirection: mobile ? "row" : "column", overflowX: "auto", alignItems: "center" }}>
          {navSections.map((section, index) => {
            const selected = section.id === activeSection;
            return (
              <Fragment key={`menu-fragment-${index}`}>
                {index > 1 && (
                  <Divider
                    key={`menu-divider-${index}`}
                    orientation={mobile ? "vertical" : "horizontal"}
                    sx={[mobile ? { height: "70%" } : { width: "70%" }]}
                  />
                )}
                <a href={section.href} key={`menu-link-${index}`}>
                  <WButton
                    sx={{
                      height: layoutHeaderHeight,
                      aspectRatio: "1/1",
                      flexDirection: "column",
                      gap: "4px",
                      fontSize: 14,
                      p: 0,
                      backgroundColor: "transparent",
                      "&:hover": { backgroundColor: "action.hover" }
                    }}
                  >
                    {(() => {
                      const icon = selected ? section.iconSelected : section.icon;
                      const renderedIcon =
                        typeof icon === "string" ? (
                          <Box
                            component="img"
                            src={icon}
                            alt=""
                            sx={{ width: index === 0 ? "100%" : 32, height: index === 0 ? "100%" : 32 }}
                          />
                        ) : (
                          icon
                        );
                      return index === 0 ? (
                        renderedIcon
                      ) : (
                        <>
                          {renderedIcon}
                          {section.name}
                        </>
                      );
                    })()}
                  </WButton>
                </a>
              </Fragment>
            );
          })}
        </Stack>
      </LayoutDivider>
      <Stack sx={{ flex: 1, overflow: "auto" }}>{children}</Stack>
    </Stack>
  );
};
