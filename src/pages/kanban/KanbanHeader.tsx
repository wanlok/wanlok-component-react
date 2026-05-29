import { Stack, Typography } from "@mui/material";
import { LayoutHeader } from "../../components/LayoutHeader";
import { WButton } from "../../components/WButton";
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
    <Stack sx={{ flexDirection: "row", height: 48 }}>
      <Stack sx={{ flex: 1, p: 1, justifyContent: "center" }}>
        <Typography variant="h6">{project?.name}</Typography>
      </Stack>
      <Stack sx={{ flexDirection: "row", gap: "1px" }}>
        <WButton sx={{ height: "100%" }} onClick={onEditButtonClick}>
          Edit
        </WButton>
        <WButton sx={{ height: "100%" }} onClick={onAddItemButtonClick}>
          Add Item
        </WButton>
        <WButton sx={{ height: "100%" }} onClick={onDeleteItemButtonClick}>
          Delete Item
        </WButton>
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
      {project.columns.map(({ name, items }, i) => {
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
            <Stack sx={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
              <Typography variant="h6">{name}</Typography>
              <Typography variant="body2" sx={{ mt: "-2px" }}>
                ({items.length})
              </Typography>
            </Stack>
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
