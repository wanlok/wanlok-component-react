import { Fragment, ReactNode } from "react";
import { Card, CardActionArea, CardContent, Divider, Stack, SxProps, Theme } from "@mui/material";

export const WCard = <T,>({
  item,
  onClick,
  children,
  sx
}: {
  item?: T;
  onClick: (item?: T) => void;
  children?: ReactNode;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 0, ...sx }}>
      <CardActionArea onClick={() => onClick(item)}>
        <CardContent sx={{ p: 0 }}>{children}</CardContent>
      </CardActionArea>
    </Card>
  );
};

export const WCardList = <T,>({
  items,
  getDepth,
  renderContent,
  onContentClick,
  renderRightContent
}: {
  items: T[];
  getDepth?: (item: T) => number;
  renderContent: (item: T) => ReactNode;
  onContentClick: (item?: T) => void;
  renderRightContent: (item: T) => ReactNode;
}) => {
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ flex: 1, backgroundColor: "common.white" }}>
        {items.map((item, index) => {
          const space = (getDepth?.(item) ?? 0) * 2;
          return (
            <Fragment key={`card-list-${index}`}>
              <Stack sx={{ flexDirection: "row", ml: space }}>
                <WCard item={item} onClick={onContentClick} sx={{ flex: 1 }}>
                  {renderContent(item)}
                </WCard>
                {renderRightContent(item)}
              </Stack>
              {index !== items.length - 1 && <Divider sx={{ ml: space + 7 }} />}
            </Fragment>
          );
        })}
      </Stack>
    </Stack>
  );
};
