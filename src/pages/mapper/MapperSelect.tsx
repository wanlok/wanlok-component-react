import { useEffect, useState } from "react";
import { readFileAsString } from "../../common/readFileAsString";
import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";

interface Item {
  image_url: string;
  name: string;
}

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

export const MapperSelect = ({ file }: { id: string; file: File }) => {
  const [items, setItems] = useState<Item[]>();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const jsonString = await readFileAsString(file);
      if (jsonString) {
        try {
          setItems(JSON.parse(jsonString) as Item[]);
        } catch (e) {}
      }
    };
    load();
  }, []);

  if (!items) {
    return <></>;
  }

  return (
    <Select
      fullWidth
      value={value}
      onChange={(e) => setValue(e.target.value)}
      renderValue={(selected) => {
        const item = items.find((i) => i.name === selected);
        return (
          <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
            <Row item={item} />
          </Stack>
        );
      }}
    >
      {items.slice(0, 5).map((item) => {
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
