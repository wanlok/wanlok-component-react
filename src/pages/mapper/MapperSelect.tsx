import { Box, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { Item } from "./useMapper";

const iconSize = 64;

const Row = ({ item }: { item: Item | undefined }) => {
  if (!item) {
    return <></>;
  }
  return (
    <>
      <Box component="img" src={item.image_url} alt="" sx={{ width: iconSize, height: iconSize, mr: 1 }} />
      <Typography
        noWrap
        sx={{
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        {item.name}
      </Typography>
    </>
  );
};

interface MapperSelectInterface {
  items: Item[] | null;
  value: string;
  onChange: (e: SelectChangeEvent<any>) => any;
}

export const MapperSelect = ({ items, value, onChange }: MapperSelectInterface) => {
  if (!items) {
    return <></>;
  }
  return (
    <Select
      fullWidth
      value={value}
      onChange={onChange}
      renderValue={(selected) => {
        const item = items.find((i) => i.name === selected);
        return (
          <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
            <Row item={item} />
          </Stack>
        );
      }}
    >
      {items.slice(0, 8).map((item) => {
        return (
          <MenuItem key={`item ${item.name}`} value={item.name}>
            <Row item={item} />
          </MenuItem>
        );
      })}
      {/* <MenuItem key={"load more"}>
        <Typography
          noWrap
          sx={{
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          Load more
        </Typography>
      </MenuItem> */}
    </Select>
  );
};
