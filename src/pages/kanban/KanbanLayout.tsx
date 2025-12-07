import { createRef, Fragment, useRef } from "react";
import { Divider, Stack, Typography } from "@mui/material";
import { useWindowDimensions } from "../../common/useWindowDimension";
import { KanbanColumn, KanbanItem, KanbanProject } from "../../services/Types";
import { KanbanCard, padding } from "./KanbanCard";

const getColumns = (
  columns: KanbanColumn[],
  i: number,
  draggedItem: KanbanItem,
  columnOffset: number,
  rowOffset: number
) => {
  const newColumns = [...columns];
  newColumns[i].items = newColumns[i].items.filter((item) => item !== draggedItem);
  let j;
  j = i + columnOffset;
  if (j < 0) {
    j = 0;
  }
  if (j >= newColumns.length) {
    j = newColumns.length - 1;
  }
  newColumns[j].items = [...newColumns[j].items];
  const column = newColumns[j];
  j = rowOffset;
  if (j < 0) {
    j = 0;
  }
  if (j > column.items.length) {
    j = column.items.length;
  }
  column.items.splice(j, 0, draggedItem);
  return newColumns;
};

export const KanbanColumnLayout = ({
  project,
  onDragStop
}: {
  project: KanbanProject;
  onDragStop: (columns: KanbanColumn[]) => void;
}) => {
  const stackRefs = useRef(project.columns.map(() => createRef<HTMLDivElement>()));
  const { height } = useWindowDimensions();
  return (
    <Stack sx={{ flex: 1, flexDirection: "row", overflow: "hidden" }}>
      {project.columns.map(({ name, items }, i) => {
        const stackRef = stackRefs.current[i];
        return (
          <Fragment key={name}>
            {i !== 0 && <Divider orientation="vertical" />}
            <Stack ref={stackRef} sx={{ flex: 1, overflowY: "auto", height: height - 100 }}>
              <Stack sx={{ p: padding, gap: 1 }}>
                {items.map((item) => (
                  <KanbanCard
                    key={item.id}
                    stackRef={stackRef}
                    stackRefs={stackRefs}
                    item={item}
                    onDragStop={(item, columnOffset, rowOffset) =>
                      onDragStop(getColumns(project.columns, i, item, columnOffset, rowOffset))
                    }
                  />
                ))}
              </Stack>
            </Stack>
          </Fragment>
        );
      })}
    </Stack>
  );
};

export const KanbanLayout = ({
  project,
  onDragStop
}: {
  project: KanbanProject | undefined;
  onDragStop: (columns: KanbanColumn[]) => void;
}) => {
  if (!project) {
    return (
      <>
        <Typography>No Project Selected</Typography>
      </>
    );
  }
  return <KanbanColumnLayout project={project} onDragStop={onDragStop} />;
};
