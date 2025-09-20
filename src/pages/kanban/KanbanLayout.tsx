import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { ReactNode, RefObject, useRef, useState } from "react";
import Draggable from "react-draggable";

const threshold = 0.25;

const getColumnWidth = (stackRef: RefObject<HTMLDivElement>) => {
  const rect = stackRef.current?.getBoundingClientRect();
  return rect ? rect.width : 0;
};

export const KanbanCard = ({
  stackRef,
  onIndexChange,
  children
}: {
  stackRef: RefObject<HTMLDivElement>;
  onIndexChange: (i: number) => void;
  children: ReactNode;
}) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <Draggable
      handle=".drag-handle"
      position={pos}
      onStop={(_, { x }) => {
        const percentage = (x + 16) / getColumnWidth(stackRef);
        const i =
          Math.abs(percentage) > threshold ? Math.sign(percentage) * Math.ceil(Math.abs(percentage) - threshold) : 0;
        console.log(i);
        if (i === 0) {
          setPos({ x: 0, y: 0 });
        } else {
          onIndexChange(i);
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
        <CardContent>{children}</CardContent>
      </Card>
    </Draggable>
  );
};

export const KanbanLayout = () => {
  const [data, setData] = useState<
    {
      ref: RefObject<HTMLDivElement>;
      list: string[];
    }[]
  >([
    { ref: useRef<HTMLDivElement>(null), list: ["AAAAA"] },
    { ref: useRef<HTMLDivElement>(null), list: ["BBBBB", "CCCCC"] },
    { ref: useRef<HTMLDivElement>(null), list: ["DDDDD", "EEEEE"] },
    { ref: useRef<HTMLDivElement>(null), list: ["FFFFF"] }
  ]);

  return (
    <Stack sx={{ flex: 1, flexDirection: "row" }}>
      {data.map(({ ref, list }, i) => (
        <>
          {i !== 0 && <Divider orientation="vertical" />}
          <Stack ref={ref} sx={{ flex: 1, p: 2 }}>
            {list.map((item) => (
              <KanbanCard
                stackRef={ref}
                key={item}
                onIndexChange={(j) => {
                  setData((prev) => {
                    const newData = [...prev];
                    newData[i].list = newData[i].list.filter((i) => i !== item);
                    const targetIndex = (i + j + newData.length) % newData.length;
                    newData[targetIndex].list = [...newData[targetIndex].list, item];
                    return newData;
                  });
                }}
              >
                <Typography>{item}</Typography>
              </KanbanCard>
            ))}
          </Stack>
        </>
      ))}
    </Stack>
  );
};
