import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";
import { WText } from "../../components/WText";
import { KanbanProject } from "../../services/Types";

const Top = ({
  project,
  onAddItemButtonClick
}: {
  project: KanbanProject | undefined;
  onAddItemButtonClick: () => void;
}) => {
  const [editable, setEditable] = useState(false);
  return (
    <Stack sx={[topSx, { height: 55 }]}>
      <Stack sx={{ flex: 1 }}>
        <WText
          text={project?.name}
          editable={editable}
          placeholder="Dummy"
          rightButtons={
            editable
              ? [
                  { label: "Save", onClick: () => {} },
                  { label: "Cancel", onClick: () => setEditable(false) }
                ]
              : [
                  { label: "Change Name", onClick: () => setEditable(true) },
                  { label: "Add Item", onClick: onAddItemButtonClick }
                ]
          }
        />
      </Stack>
    </Stack>
  );
};

const Bottom = ({ project }: { project: KanbanProject | undefined }) => {
  if (!project) {
    return <></>;
  }
  return (
    <Stack sx={{ flex: 1, flexDirection: "row", gap: "1px" }}>
      {project.columns.map(({ name }, i) => {
        return (
          <Stack
            key={`column-${i}`}
            sx={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "common.black",
              color: "common.white",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16
            }}
          >
            <Typography variant="body1">{name}</Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export const KanbanHeader = ({
  project,
  onAddItemButtonClick
}: {
  project: KanbanProject | undefined;
  onAddItemButtonClick: () => void;
}) => {
  return (
    <LayoutHeader
      top={<Top project={project} onAddItemButtonClick={onAddItemButtonClick} />}
      bottom={<Bottom project={project} />}
    />
  );
};
