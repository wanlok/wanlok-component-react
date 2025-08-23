import { ReactNode } from "react";
import { Card, CardActionArea, CardContent, Stack, SxProps, Theme } from "@mui/material";

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
      <Stack sx={{ gap: "1px" }}>
        {items.map((item, index) => (
          <Stack key={`card-list-${index}`} sx={{ flexDirection: "row" }}>
            {/* {index > 0 && <Divider sx={{ mx: 2 }} />} */}
            <WCard item={item} onClick={onContentClick} sx={{ flex: 1 }}>
              {renderContent(item)}
            </WCard>
            {renderRightContent(item)}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
