import { Stack, Typography } from "@mui/material";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";
import { WText } from "../../components/WText";
import { KanbanProject } from "../../services/Types";

const Top = ({
  project,
  onEditButtonClick,
  onAddItemButtonClick,
  onDeleteItemButtonClick
}: {
  project: KanbanProject | undefined;
  onEditButtonClick: () => void;
  onAddItemButtonClick: () => void;
  onDeleteItemButtonClick: () => void;
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
            { label: "Add Item", onClick: onAddItemButtonClick },
            { label: "Delete Item", onClick: onDeleteItemButtonClick }
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
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8
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
  onAddItemButtonClick,
  onDeleteItemButtonClick
}: {
  project: KanbanProject | undefined;
  onEditButtonClick: () => void;
  onAddItemButtonClick: () => void;
  onDeleteItemButtonClick: () => void;
}) => {
  return (
    <LayoutHeader
      top={
        <Top
          project={project}
          onEditButtonClick={onEditButtonClick}
          onAddItemButtonClick={onAddItemButtonClick}
          onDeleteItemButtonClick={onDeleteItemButtonClick}
        />
      }
      bottom={<Bottom project={project} />}
    />
  );
};
