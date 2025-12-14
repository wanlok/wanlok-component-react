import { RefObject, useRef } from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import Draggable from "react-draggable";
import { KanbanItem } from "../../services/Types";

export const padding = 2;
export const threshold = 4;

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
  const nodes = Array.from(stackRef.current?.children[0]?.children ?? []) as HTMLElement[];
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

export const KanbanCard = ({
  stackRef,
  stackRefs,
  item,
  onDragStop,
  onClick
}: {
  stackRef: RefObject<HTMLDivElement>;
  stackRefs: RefObject<RefObject<HTMLDivElement>[]>;
  item: KanbanItem;
  onDragStop: (item: KanbanItem, columnOffset: number, rowOffset: number) => void;
  onClick: () => void;
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragged = useRef(false);
  const getX = () => nodeRef.current?.getBoundingClientRect()?.x ?? 0;
  const getY = () => nodeRef.current?.getBoundingClientRect()?.y ?? 0;
  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      position={{ x: 0, y: 0 }}
      onStart={(_, { node: draggedNode }) => {
        startX.current = getX();
        startY.current = getY();
        dragged.current = false;
        for (const stackRef of stackRefs.current ?? []) {
          if (stackRef.current) {
            stackRef.current.style.marginTop = "-" + stackRef.current.scrollTop + "px";
            stackRef.current.style.overflowY = "visible";
          }
          const nodes = Array.from(stackRef.current?.children[0]?.children ?? []) as HTMLElement[];
          for (const node of nodes) {
            node.style.zIndex = node === draggedNode ? "1" : "";
          }
        }
      }}
      onStop={(_, { x, y, node: draggedNode }) => {
        const offsetX = Math.abs(startX.current - getX());
        const offsetY = Math.abs(startY.current - getY());
        if (offsetX <= threshold && offsetY <= threshold) {
          return;
        }
        dragged.current = true;
        const i = stackRefs.current?.indexOf(stackRef);
        if (i !== undefined) {
          const columnOffset = getColumnOffset(stackRef, x);
          const targetStackRef = stackRefs.current?.[i + columnOffset];
          if (targetStackRef) {
            const rowOffset = getRowOffset(targetStackRef, y, draggedNode, columnOffset);
            onDragStop(item, columnOffset, rowOffset);
          }
        }
        for (const stackRef of stackRefs.current ?? []) {
          if (stackRef.current) {
            stackRef.current.style.marginTop = 0 + "px";
            stackRef.current.style.overflowY = "auto";
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
        <CardActionArea
          onClick={() => {
            if (!dragged.current) {
              onClick();
            }
          }}
        >
          <CardContent>
            <Typography>{item.name}</Typography>
            <Typography>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Draggable>
  );
};
