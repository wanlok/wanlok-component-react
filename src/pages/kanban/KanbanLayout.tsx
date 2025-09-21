import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { Fragment, RefObject, useRef, useState } from "react";
import Draggable from "react-draggable";

const data = [
  { name: "column-1", list: ["AAAAA"] },
  { name: "column-2", list: ["BBBBB", "CCCCC"] },
  { name: "column-3", list: ["DDDDD", "EEEEE"] },
  { name: "column-4", list: ["FFFFF"] }
];

const padding = 16;

const xThreshold = 0.8;
// const yThreshold = 1;

const getColumnWidthAndHeight = (stackRef: RefObject<HTMLDivElement>) => {
  const rect = stackRef.current?.getBoundingClientRect();
  return rect ? { width: rect.width, height: rect.height } : { width: 0, height: 0 };
};

const getColumnOffset = (stackRef: RefObject<HTMLDivElement>, x: number) => {
  const ratio = (x + padding) / getColumnWidthAndHeight(stackRef).width;
  return Math.abs(ratio) > xThreshold ? Math.sign(ratio) * Math.ceil(Math.abs(ratio) - xThreshold) : 0;
};

const getRowOffset = (stackRef: RefObject<HTMLDivElement>, node: HTMLElement) => {
  let offset = 0;
  const children = stackRef.current?.children ?? [];
  for (let i = 0; i < children.length; i++) {
    if (children[i] !== node) {
      if (node.getBoundingClientRect().y >= children[i].getBoundingClientRect().y) {
        offset = i;
      }
    }
  }
  return offset;
};

const KanbanCard = ({
  stackRef,
  item,
  onColumnChange,
  onRowChange
}: {
  stackRef: RefObject<HTMLDivElement>;
  item: string;
  onColumnChange: (item: string, i: number) => void;
  onRowChange: (item: string, rowOffset: number) => void;
}) => {
  const nodeRef = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      position={{ x: 0, y: 0 }}
      onStop={(_, { x, node }) => {
        const columnOffset = getColumnOffset(stackRef, x);
        if (columnOffset === 0) {
          onRowChange(item, getRowOffset(stackRef, node));
        } else {
          onColumnChange(item, columnOffset);
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
        <CardContent>
          <Typography>{item}</Typography>
        </CardContent>
      </Card>
    </Draggable>
  );
};

const KanbanColumn = ({
  list,
  onColumnChange,
  onRowChange
}: {
  list: string[];
  onColumnChange: (item: string, i: number) => void;
  onRowChange: (item: string, rowOffset: number) => void;
}) => {
  const stackRef = useRef<HTMLDivElement>(null);
  return (
    <Stack ref={stackRef} sx={{ flex: 1, p: padding + "px" }}>
      {list.map((item) => (
        <KanbanCard
          key={item}
          stackRef={stackRef}
          item={item}
          onColumnChange={onColumnChange}
          onRowChange={onRowChange}
        />
      ))}
    </Stack>
  );
};

export const KanbanLayout = () => {
  const [columns, setColumns] = useState(data);
  return (
    <Stack sx={{ flex: 1, flexDirection: "row" }}>
      {columns.map(({ name, list }, i) => (
        <Fragment key={name}>
          {i !== 0 && <Divider orientation="vertical" />}
          <KanbanColumn
            list={list}
            onColumnChange={(selectedItem, columnOffset) => {
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
                newColumns[j].list = [...newColumns[j].list, selectedItem];
                return newColumns;
              });
            }}
            onRowChange={(selectedItem, rowOffset) => {
              setColumns((prev) => {
                const newColumns = [...prev];
                const column = newColumns[i];
                column.list.splice(column.list.indexOf(selectedItem), 1);
                let j = rowOffset;
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
