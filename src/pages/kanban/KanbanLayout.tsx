import { Card, CardActionArea, CardContent, Divider, Stack, Typography } from "@mui/material";
import { createRef, Fragment, RefObject, useRef, useState } from "react";
import Draggable from "react-draggable";

const data = [
  { name: "column-1", list: ["AAAAA"] },
  { name: "column-2", list: ["BBBBB", "CCCCC"] },
  { name: "column-3", list: ["DDDDD", "EEEEE"] },
  { name: "column-4", list: ["FFFFF"] }
];

const padding = 2;

const getColumnOffset = (stackRef: RefObject<HTMLDivElement>, x: number) => {
  const threshold = 0.25;
  const width = stackRef.current?.getBoundingClientRect().width ?? 0;
  const ratio = (x + padding * 8) / width;
  return Math.abs(ratio) > threshold ? Math.sign(ratio) * Math.ceil(Math.abs(ratio) - threshold) : 0;
};

const getRowOffset = (stackRef: RefObject<HTMLDivElement>, y: number, node: HTMLElement, columnOffset: number) => {
  let offset = -1;
  const children = Array.from(stackRef.current?.children ?? []) as HTMLElement[];
  for (let i = 0; i < children.length; i++) {
    if (children[i] === node) {
      if (
        (i + 1 < children.length &&
          children[i].getBoundingClientRect().bottom - children[i + 1].getBoundingClientRect().y > 0) ||
        (i + 1 >= children.length && y > 0)
      ) {
        offset = i;
      }
    } else {
      if (columnOffset !== 0) {
        if (i > 0) {
          if (
            node.getBoundingClientRect().y >=
            children[i - 1].getBoundingClientRect().y + children[i - 1].getBoundingClientRect().height / 2
          ) {
            offset = i;
          }
        }
        if (
          node.getBoundingClientRect().y >=
          children[i].getBoundingClientRect().y + children[i].getBoundingClientRect().height / 2
        ) {
          offset = i + 1;
        }
      } else {
        if (node.getBoundingClientRect().y >= children[i].getBoundingClientRect().y) {
          offset = i;
        }
      }
    }
  }
  return y < 0 ? offset + 1 : offset;
};

const KanbanCard = ({
  stackRef,
  stackRefs,
  item,
  onColumnChange
}: {
  stackRef: RefObject<HTMLDivElement>;
  stackRefs: RefObject<RefObject<HTMLDivElement>[]>;
  item: string;
  onColumnChange: (item: string, columnOffset: number, rowOffset: number) => void;
}) => {
  const nodeRef = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      position={{ x: 0, y: 0 }}
      onStop={(_, { x, y, node }) => {
        const i = stackRefs.current?.indexOf(stackRef);
        if (i !== undefined) {
          const columnOffset = getColumnOffset(stackRef, x);
          const targetStackRef = stackRefs.current?.[i + columnOffset];
          if (targetStackRef) {
            const rowOffset = getRowOffset(targetStackRef, y, node, columnOffset);
            onColumnChange(item, columnOffset, rowOffset);
          }
        }
      }}
    >
      <Card
        ref={nodeRef}
        sx={{
          boxShadow: 6,
          borderRadius: 2
        }}
        className="drag-handle"
      >
        <CardActionArea onClick={() => {}}>
          <CardContent>
            <Typography>{item}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Draggable>
  );
};

const KanbanColumn = ({
  stackRef,
  stackRefs,
  list,
  onColumnChange
}: {
  stackRef: RefObject<HTMLDivElement>;
  stackRefs: RefObject<RefObject<HTMLDivElement>[]>;
  list: string[];
  onColumnChange: (item: string, i: number, j: number) => void;
}) => {
  return (
    <Stack ref={stackRef} sx={{ flex: 1, p: padding, gap: 1 }}>
      {list.map((item) => (
        <KanbanCard key={item} stackRef={stackRef} stackRefs={stackRefs} item={item} onColumnChange={onColumnChange} />
      ))}
    </Stack>
  );
};

export const KanbanLayout = () => {
  const [columns, setColumns] = useState(data);
  const stackRefs = useRef(data.map(() => createRef<HTMLDivElement>()));
  return (
    <Stack sx={{ flex: 1, flexDirection: "row" }}>
      {columns.map(({ name, list }, i) => (
        <Fragment key={name}>
          {i !== 0 && <Divider orientation="vertical" />}
          <KanbanColumn
            stackRef={stackRefs.current[i]}
            stackRefs={stackRefs}
            list={list}
            onColumnChange={(selectedItem, columnOffset, rowOffset) => {
              setColumns((prev) => {
                const newColumns = [...prev];
                newColumns[i].list = newColumns[i].list.filter((item) => item !== selectedItem);
                let j = i + columnOffset;
                if (j < 0) {
                  j = 0;
                }
                if (j >= newColumns.length) {
                  j = newColumns.length - 1;
                }
                newColumns[j].list = [...newColumns[j].list];

                const column = newColumns[j];

                j = rowOffset;
                if (j < 0) {
                  j = 0;
                }
                if (j > column.list.length) {
                  j = column.list.length;
                }
                column.list.splice(j, 0, selectedItem);

                return newColumns;
              });
            }}
          />
        </Fragment>
      ))}
    </Stack>
  );
};
