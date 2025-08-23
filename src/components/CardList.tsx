import { Fragment, ReactNode } from "react";
import { Card, CardActionArea, CardContent, Stack, SxProps, Theme } from "@mui/material";

export interface CardItem {
  [key: string]: any;
}

export const WCard = ({
  item,
  onItemClick,
  children,
  sx
}: {
  item?: { [key: string]: any };
  onItemClick: (item?: CardItem) => void;
  children?: ReactNode;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 0, ...sx }}>
      <CardActionArea onClick={() => onItemClick(item)}>
        <CardContent sx={{ p: 0 }}>{children}</CardContent>
      </CardActionArea>
    </Card>
  );
};

export const CardList = ({
  items,
  renderItem,
  onItemClick
}: {
  items: { [key: string]: any }[];
  renderItem: (item: CardItem, index: number) => ReactNode;
  onItemClick: (item?: CardItem) => void;
}) => {
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ gap: "1px" }}>
        {items.map((item, index) => (
          <Fragment key={`card-list-${index}`}>
            {/* {index > 0 && <Divider sx={{ mx: 2 }} />} */}
            <WCard item={item} onItemClick={onItemClick}>
              {renderItem(item, index)}
            </WCard>
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};
