import { Stack, Typography } from "@mui/material";
import { StyledContainer } from "../../components/StyledContainer";
import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";
import { useEffect, useState } from "react";
import { KanbanProject } from "../../services/Types";
import { getDaysSinceString, getDisplayDateTimeString } from "../../common/DateUtils";

const defaultColumnNames: Record<number, string[]> = {
  1: ["To Do"],
  2: ["To Do", "Done"],
  3: ["To Do", "In Progress", "Done"],
  4: ["To Do", "In Progress", "Ready To Deploy", "Done"],
  5: ["To Do", "In Progress", "In Review", "Ready To Deploy", "Done"]
};

export const ProjectModal = ({
  open,
  onClose,
  project,
  onSaveButtonClick
}: {
  open: boolean;
  onClose: () => void;
  project?: KanbanProject;
  onSaveButtonClick: (name: string, columns: string[]) => void;
}) => {
  const [name, setName] = useState("");
  const [columns, setColumns] = useState<string[]>(["To Do", "In Progress", "Ready To Deploy", "Done"]);

  useEffect(() => {
    if (open) {
      if (project) {
        setName(project.name);
        setColumns(project.columns.map((column) => column.name));
      } else {
        setName("");
        setColumns(["To Do", "In Progress", "Ready To Deploy", "Done"]);
      }
    }
  }, [open, project]);

  return (
    <WModal
      open={open}
      onClose={onClose}
      tabs={[{ label: project ? "Edit Project" : "Create Project" }]}
      bottom={
        <YesNoButtons
          yesLabel="Save"
          onYesClick={() => onSaveButtonClick(name, columns)}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
    >
      <Stack sx={{ gap: "1px", p: 2 }}>
        {project?.created_at && (
          <Stack sx={{ pb: 1 }}>
            <Typography variant="body2" sx={{ textAlign: "right" }}>
              {getDisplayDateTimeString(new Date(project.created_at))} (
              {getDaysSinceString(new Date(project.created_at))})
            </Typography>
          </Stack>
        )}
        <StyledContainer sx={{ p: 1 }}>
          <TextInput label="Name" value={name} onChange={(value) => setName(value)} inputPropsSx={{ flex: 1 }} />
        </StyledContainer>
        <StyledContainer sx={{ p: 1 }}>
          <Stack sx={{ gap: 1 }}>
            <SelectInput
              label="Number of Columns"
              items={Array.from({ length: 5 }, (_, i) => ({
                label: String(i + 1),
                value: String(i + 1)
              }))}
              value={String(columns.length)}
              onChange={(count) => {
                setColumns(defaultColumnNames[parseInt(count)]);
              }}
            />
            {columns.map((column, i) => (
              <TextInput
                key={`column-${i}`}
                label={`Column ${i + 1}`}
                value={column}
                onChange={(value) => {
                  const newColumns = [...columns];
                  newColumns[i] = value;
                  setColumns(newColumns);
                }}
                inputPropsSx={{ flex: 1 }}
              />
            ))}
          </Stack>
        </StyledContainer>
      </Stack>
    </WModal>
  );
};
