import { Card, CardActionArea, CardContent, Divider, Stack, Typography } from "@mui/material";
import { createRef, Fragment, RefObject, useRef } from "react";
import Draggable from "react-draggable";
import { ColumnData, ColumnItem, useKanban } from "./useKanban";

const padding = 2;

const getColumnOffset = (stackRef: RefObject<HTMLDivElement>, x: number) => {
  const threshold = 0.25;
  const width = stackRef.current?.getBoundingClientRect().width ?? 0;
  const ratio = (x + padding * 8) / width;
  return Math.abs(ratio) > threshold ? Math.sign(ratio) * Math.ceil(Math.abs(ratio) - threshold) : 0;
};

const getRowOffset = (
  stackRef: RefObject<HTMLDivElement>,
  y: number,
  draggedNode: HTMLElement,
  columnOffset: number
) => {
  let offset = -1;
  const nodes = Array.from(stackRef.current?.children ?? []) as HTMLElement[];
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i] === draggedNode) {
      if (
        (i + 1 < nodes.length &&
          nodes[i].getBoundingClientRect().bottom - nodes[i + 1].getBoundingClientRect().y > 0) ||
        (i + 1 >= nodes.length && y > 0)
      ) {
        offset = i;
      }
    } else {
      if (columnOffset !== 0) {
        if (
          i > 0 &&
          draggedNode.getBoundingClientRect().y >=
            nodes[i - 1].getBoundingClientRect().y + nodes[i - 1].getBoundingClientRect().height / 2
        ) {
          offset = i;
        }
        if (
          draggedNode.getBoundingClientRect().y >=
          nodes[i].getBoundingClientRect().y + nodes[i].getBoundingClientRect().height / 2
        ) {
          offset = i + 1;
        }
      } else {
        if (draggedNode.getBoundingClientRect().y >= nodes[i].getBoundingClientRect().y) {
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
  onDragStop
}: {
  stackRef: RefObject<HTMLDivElement>;
  stackRefs: RefObject<RefObject<HTMLDivElement>[]>;
  item: ColumnItem;
  onDragStop: (item: ColumnItem, columnOffset: number, rowOffset: number) => void;
}) => {
  const nodeRef = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      position={{ x: 0, y: 0 }}
      onStart={(_, { node: draggedNode }) => {
        for (const stackRef of stackRefs.current ?? []) {
          const nodes = Array.from(stackRef.current?.children ?? []) as HTMLElement[];
          for (const node of nodes) {
            node.style.zIndex = node === draggedNode ? "1" : "";
          }
        }
      }}
      onStop={(_, { x, y, node: draggedNode }) => {
        const i = stackRefs.current?.indexOf(stackRef);
        if (i !== undefined) {
          const columnOffset = getColumnOffset(stackRef, x);
          const targetStackRef = stackRefs.current?.[i + columnOffset];
          if (targetStackRef) {
            const rowOffset = getRowOffset(targetStackRef, y, draggedNode, columnOffset);
            onDragStop(item, columnOffset, rowOffset);
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
            <Typography>{item.name}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Draggable>
  );
};

const getColumns = (
  columns: ColumnData[],
  i: number,
  draggedItem: ColumnItem,
  columnOffset: number,
  rowOffset: number
) => {
  const newColumns = [...columns];
  newColumns[i].list = newColumns[i].list.filter((item) => item !== draggedItem);
  let j;
  j = i + columnOffset;
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
  column.list.splice(j, 0, draggedItem);
  return newColumns;
};

export const KanbanLayout = () => {
  const { columns, setColumns } = useKanban();
  const stackRefs = useRef(columns.map(() => createRef<HTMLDivElement>()));
  return (
    <Stack sx={{ flex: 1, flexDirection: "row" }}>
      {columns.map(({ name, list }, i) => {
        const stackRef = stackRefs.current[i];
        return (
          <Fragment key={name}>
            {i !== 0 && <Divider orientation="vertical" />}
            <Stack ref={stackRef} sx={{ flex: 1, p: padding, gap: 1 }}>
              {list.map((item) => (
                <KanbanCard
                  key={item.id}
                  stackRef={stackRef}
                  stackRefs={stackRefs}
                  item={item}
                  onDragStop={(item, columnOffset, rowOffset) =>
                    setColumns(getColumns(columns, i, item, columnOffset, rowOffset))
                  }
                />
              ))}
            </Stack>
          </Fragment>
        );
      })}
    </Stack>
  );
};
