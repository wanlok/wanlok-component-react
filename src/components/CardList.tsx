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
  rows,
  renderContent,
  onContentClick
}: {
  rows: { [key: string]: any }[];
  renderContent: (item: any, index: number) => ReactNode;
  onContentClick: (item?: any) => void;
}) => {
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ gap: "1px" }}>
        {rows.map((row, index) => (
          <Stack key={`card-list-${index}`} sx={{ flexDirection: "row" }}>
            {/* {index > 0 && <Divider sx={{ mx: 2 }} />} */}
            <WCard item={row} onClick={onContentClick} sx={{ flex: 1 }}>
              {renderContent(row, index)}
            </WCard>
            {/* <Button>Button</Button> */}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
