import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { RefObject, useRef, useState } from "react";
import Draggable from "react-draggable";

const xThreshold = 0.25;
// const yThreshold = 1;

const getColumnWidthAndHeight = (stackRef: RefObject<HTMLDivElement>) => {
  const rect = stackRef.current?.getBoundingClientRect();
  return rect ? { width: rect.width, height: rect.height } : { width: 0, height: 0 };
};

const KanbanCard = ({
  stackRef,
  item,
  onIndexChange
}: {
  stackRef: RefObject<HTMLDivElement>;
  item: string;
  onIndexChange: (item: string, i: number) => void;
}) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <Draggable
      handle=".drag-handle"
      position={pos}
      onStop={(_, { x, y }) => {
        const { width } = getColumnWidthAndHeight(stackRef);
        const xDiff = (x + 16) / width;
        const i = Math.abs(xDiff) > xThreshold ? Math.sign(xDiff) * Math.ceil(Math.abs(xDiff) - xThreshold) : 0;
        if (i === 0) {
          setPos({ x: 0, y: 0 });
        } else {
          onIndexChange(item, i);
        }
      }}
    >
      <Card
        sx={{
          // position: "absolute",
          width: "100%",
          boxShadow: 6,
          borderRadius: 2
        }}
        className="drag-handle"
      >
        <CardContent>
          <Typography>{item}</Typography>
        </CardContent>
      </Card>
    </Draggable>
  );
};

const KanbanColumn = ({
  list,
  onIndexChange
}: {
  list: string[];
  onIndexChange: (item: string, i: number) => void;
}) => {
  const stackRef = useRef<HTMLDivElement>(null);
  return (
    <Stack ref={stackRef} sx={{ flex: 1, p: 2 }}>
      {list.map((item) => (
        <KanbanCard stackRef={stackRef} key={item} item={item} onIndexChange={onIndexChange} />
      ))}
    </Stack>
  );
};

export const KanbanLayout = () => {
  const [data, setData] = useState<
    {
      list: string[];
    }[]
  >([{ list: ["AAAAA"] }, { list: ["BBBBB", "CCCCC"] }, { list: ["DDDDD", "EEEEE"] }, { list: ["FFFFF"] }]);

  return (
    <Stack sx={{ flex: 1, flexDirection: "row" }}>
      {data.map(({ list }, i) => (
        <>
          {i !== 0 && <Divider orientation="vertical" />}
          <KanbanColumn
            list={list}
            onIndexChange={(item, j) => {
              setData((prev) => {
                const newData = [...prev];
                newData[i].list = newData[i].list.filter((i) => i !== item);
                const k = (i + j + newData.length) % newData.length;
                newData[k].list = [...newData[k].list, item];
                return newData;
              });
            }}
          />
        </>
      ))}
    </Stack>
  );
};
