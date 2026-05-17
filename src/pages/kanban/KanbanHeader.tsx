import { Stack, Typography } from "@mui/material";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";
import { WText } from "../../components/WText";
import { KanbanProject } from "../../services/Types";

const Top = ({
  project,
  onEditButtonClick,
  onAddItemButtonClick
}: {
  project: KanbanProject | undefined;
  onEditButtonClick: () => void;
  onAddItemButtonClick: () => void;
}) => {
  return (
    <Stack sx={[topSx, { height: 55 }]}>
      <Stack sx={{ flex: 1 }}>
        <WText
          text={project?.name}
          editable={false}
          placeholder="Dummy"
          rightButtons={[
            { label: "Edit", onClick: onEditButtonClick },
            { label: "Add Item", onClick: onAddItemButtonClick }
          ]}
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
  onEditButtonClick,
  onAddItemButtonClick
}: {
  project: KanbanProject | undefined;
  onEditButtonClick: () => void;
  onAddItemButtonClick: () => void;
}) => {
  return (
    <LayoutHeader
      top={<Top project={project} onEditButtonClick={onEditButtonClick} onAddItemButtonClick={onAddItemButtonClick} />}
      bottom={<Bottom project={project} />}
    />
  );
};
