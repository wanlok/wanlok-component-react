import { Fragment, ReactNode } from "react";
import { Card, CardActionArea, CardContent, Divider, Stack, SxProps, Theme } from "@mui/material";

export const WCard = ({
  item,
  onClick,
  children,
  sx
}: {
  item?: { [key: string]: any };
  onClick: (item?: any) => void;
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

export const CardList = ({
  items,
  renderContent,
  onContentClick,
  renderRightContent
}: {
  items: { [key: string]: any }[];
  renderContent: (item: any) => ReactNode;
  onContentClick: (item?: any) => void;
  renderRightContent: (item: any) => ReactNode;
}) => {
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ gap: "0px" }}>
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
