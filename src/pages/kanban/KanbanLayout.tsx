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
  const newColumns = columns.map((column) => ({ ...column, items: [...column.items] }));
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
  controlGroupState,
  onDragStop,
  onClick,
  onDeleteItemClick
}: {
  project: KanbanProject;
  controlGroupState: number;
  onDragStop: (columns: KanbanColumn[]) => void;
  onClick: (i: number, j: number) => void;
  onDeleteItemClick: (i: number, j: number) => void;
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
                {items.map((item, j) => (
                  <KanbanCard
                    key={item.id}
                    stackRef={stackRef}
                    stackRefs={stackRefs}
                    item={item}
                    onDragStop={(item, columnOffset, rowOffset) =>
                      onDragStop(getColumns(project.columns, i, item, columnOffset, rowOffset))
                    }
                    onClick={() => onClick(i, j)}
                    controlGroupState={controlGroupState}
                    onDeleteItemClick={() => onDeleteItemClick(i, j)}
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
  controlGroupState,
  onDragStop,
  onClick,
  onDeleteItemClick
}: {
  project: KanbanProject | undefined;
  controlGroupState: number;
  onDragStop: (columns: KanbanColumn[]) => void;
  onClick: (i: number, j: number) => void;
  onDeleteItemClick: (i: number, j: number) => void;
}) => {
  if (!project) {
    return (
      <>
        <Typography>No Project Selected</Typography>
      </>
    );
  }
  return (
    <KanbanColumnLayout
      key={`${project.id}-${project.columns.length}`}
      project={project}
      controlGroupState={controlGroupState}
      onDragStop={onDragStop}
      onClick={onClick}
      onDeleteItemClick={onDeleteItemClick}
    />
  );
};
