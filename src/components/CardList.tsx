import { Fragment, ReactNode } from "react";
import { Card, CardActionArea, CardContent, Stack, SxProps, Theme } from "@mui/material";

export interface CardItem {
  [key: string]: any;
}

export const CardList = ({
  items,
  width,
  renderItem,
  onItemClick,
  sx
}: {
  items: { [key: string]: any }[];
  width: number;
  renderItem: (item: CardItem, index: number) => ReactNode;
  onItemClick: (item: CardItem) => void;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Stack sx={{ width, overflowY: "auto", ...sx }}>
      <Stack sx={{ gap: "1px" }}>
        {items.map((item, index) => (
          <Fragment key={`card-list-${index}`}>
            {/* {index > 0 && <Divider sx={{ mx: 2 }} />} */}
            <Card elevation={0} sx={{ borderRadius: 0 }}>
              <CardActionArea onClick={() => onItemClick(item)}>
                <CardContent sx={{ p: 0 }}>{renderItem(item, index)}</CardContent>
              </CardActionArea>
            </Card>
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};
