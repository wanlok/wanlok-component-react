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
  renderContent,
  onContentClick,
  renderRightContent
}: {
  items: T[];
  renderContent: (item: T) => ReactNode;
  onContentClick: (item?: T) => void;
  renderRightContent: (item: T) => ReactNode;
}) => {
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ flex: 1, backgroundColor: "common.white" }}>
        {items.map((item, index) => (
          <Fragment key={`card-list-${index}`}>
            {index > 0 && <Divider sx={{ ml: 7, mr: 0 }} />}
            <Stack sx={{ flexDirection: "row" }}>
              <WCard item={item} onClick={onContentClick} sx={{ flex: 1 }}>
                {renderContent(item)}
              </WCard>
              {renderRightContent(item)}
            </Stack>
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};
