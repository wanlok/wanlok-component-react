import { ReactNode } from "react";
import { Card, CardActionArea, CardContent, Stack, SxProps, Theme } from "@mui/material";

export const WCard = ({
  item,
  onItemClick,
  children,
  sx
}: {
  item?: { [key: string]: any };
  onItemClick: (item?: any) => void;
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
  renderItem: (item: any, index: number) => ReactNode;
  onItemClick: (item?: any) => void;
}) => {
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ gap: "1px" }}>
        {items.map((item, index) => (
          <Stack key={`card-list-${index}`} sx={{ flexDirection: "row" }}>
            {/* {index > 0 && <Divider sx={{ mx: 2 }} />} */}
            <WCard item={item} onItemClick={onItemClick} sx={{ flex: 1 }}>
              {renderItem(item, index)}
            </WCard>
            {/* <Button>Button</Button> */}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
