import { createRef, Fragment, useRef, useState } from "react";
import { Box, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useWindowDimensions } from "../../common/useWindowDimension";
import { KanbanColumn, KanbanItem, KanbanProject } from "../../services/Types";
import { KanbanCard, padding } from "./KanbanCard";
import { LayoutPanel } from "../../components/LayoutPanel";
import { WCardList } from "../../components/WCardList";

import UpWhiteIcon from "../../assets/images/icons/up_white.png";
import DownWhiteIcon from "../../assets/images/icons/down_white.png";

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

const ColumnRow = ({ column, panelOpened }: { column: KanbanColumn; panelOpened?: boolean }) => {
  const mobileRow = panelOpened === true || panelOpened === false;
  return (
    <Stack sx={{ backgroundColor: "background.default" }}>
      <Stack
        sx={{
          flexDirection: "row",
          p: 2,
          alignItems: "center",
          backgroundColor: "common.black",
          color: "common.white",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}
      >
        <Stack sx={{ flexDirection: "row", flex: 1, gap: 1 }}>
          <Typography>{column.name}</Typography>
          <Typography variant="body2">({column.items.length})</Typography>
        </Stack>
        {mobileRow && (
          <Box
            component="img"
            src={panelOpened ? UpWhiteIcon : DownWhiteIcon}
            alt=""
            sx={{ width: "16px", height: "16px" }}
          />
        )}
      </Stack>
    </Stack>
  );
};

const KanbanMobileLayout = ({
  project,
  controlGroupState,
  onClick,
  onDeleteItemClick
}: {
  project: KanbanProject;
  controlGroupState: number;
  onClick: (i: number, j: number) => void;
  onDeleteItemClick: (i: number, j: number) => void;
}) => {
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(0);
  const [panelOpened, setPanelOpened] = useState(false);
  const dummyRef = useRef<HTMLDivElement>(null);
  const dummyRefs = useRef([dummyRef]);

  const selectedColumn = project.columns[selectedColumnIndex];

  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={200}
      panel={
        <WCardList
          items={project.columns}
          renderContent={(column) => (
            <Stack sx={{ flexDirection: "row", gap: 1, ml: 7, py: 2, pr: 2 }}>
              <Typography>{column.name}</Typography>
              <Typography variant="body2">({column.items.length})</Typography>
            </Stack>
          )}
          onContentClick={(column) => {
            setSelectedColumnIndex(project.columns.indexOf(column));
            setPanelOpened(false);
          }}
          renderRightContent={() => <Stack />}
        />
      }
      topChildren={<ColumnRow column={selectedColumn} panelOpened={panelOpened} />}
      sx={{ height: 0 }}
    >
      <Stack sx={{ flex: 1, overflowY: "auto" }}>
        <Stack sx={{ p: padding, gap: 1 }}>
          {selectedColumn.items.map((item, j) => (
            <KanbanCard
              key={item.id}
              stackRef={dummyRef}
              stackRefs={dummyRefs}
              item={item}
              onDragStop={() => {}}
              onClick={() => onClick(selectedColumnIndex, j)}
              controlGroupState={controlGroupState}
              onDeleteItemClick={() => onDeleteItemClick(selectedColumnIndex, j)}
              draggable={false}
            />
          ))}
        </Stack>
      </Stack>
    </LayoutPanel>
  );
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
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));

  if (!project) {
    return (
      <>
        <Typography>No Project Selected</Typography>
      </>
    );
  }

  if (mobile) {
    return (
      <KanbanMobileLayout
        key={`${project.id}-${project.columns.length}`}
        project={project}
        controlGroupState={controlGroupState}
        onClick={onClick}
        onDeleteItemClick={onDeleteItemClick}
      />
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
