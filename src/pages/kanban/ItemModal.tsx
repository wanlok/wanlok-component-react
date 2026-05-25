import { useState } from "react";
import { Divider, Stack, Typography } from "@mui/material";
import { WModal } from "../../components/WModal";
import { KanbanItem, KanbanProject } from "../../services/Types";
import { WButton } from "../../components/WButton";
import { TextInput } from "../../components/TextInput";
import { getDaysSinceString, getDisplayDateTimeString } from "../../common/DateUtils";

const View = ({ kanbanItem, onEditButtonClick }: { kanbanItem: KanbanItem; onEditButtonClick: () => void }) => {
  return (
    <>
      <Stack sx={{ p: 2, gap: 2 }}>
        <Typography variant="h6" sx={{ color: kanbanItem.name ? "text.primary" : "text.disabled", fontWeight: "100" }}>
          {kanbanItem.name || "No name"}
        </Typography>
        <Divider />
        <Stack sx={{ flexDirection: "row" }}>
          <Typography variant="body2" sx={{ flex: 0.28, fontWeight: "600" }}>
            Created Date
          </Typography>
          <Typography variant="body2" sx={{ flex: 0.72 }}>
            {getDisplayDateTimeString(new Date(kanbanItem.created_at))} (
            {getDaysSinceString(new Date(kanbanItem.created_at))})
          </Typography>
        </Stack>
        <Divider />
        <Typography variant="body1" sx={{ color: kanbanItem.content ? "text.primary" : "text.disabled" }}>
          {kanbanItem.content || "No content"}
        </Typography>
      </Stack>
      <WButton onClick={onEditButtonClick}>Edit</WButton>
    </>
  );
};

const Edit = ({
  kanbanItem,
  onSaveButtonClick
}: {
  kanbanItem: KanbanItem;
  onSaveButtonClick: (name: string, content: string) => void;
}) => {
  const [name, setName] = useState(kanbanItem.name);
  const [content, setContent] = useState(kanbanItem.content);
  return (
    <>
      <Stack sx={{ px: 1, pt: 2, pb: "12px" }}>
        <Typography variant="h6">Edit</Typography>
      </Stack>
      <Divider />
      <Stack sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
        <Stack sx={{ flex: 1, gap: 1, p: 1 }}>
          <TextInput label="Name" value={name} onChange={setName} hideHelperText={true} inputPropsSx={{ flex: 1 }} />
          <TextInput
            label="Created Date"
            value={getDisplayDateTimeString(new Date(kanbanItem.created_at))}
            onChange={() => {}}
            hideHelperText={true}
            inputPropsSx={{ flex: 1 }}
            disabled={true}
          />
          <TextInput
            label="Content"
            value={content}
            onChange={setContent}
            hideHelperText={true}
            minRows={4}
            inputPropsSx={{ flex: 1 }}
          />
        </Stack>
      </Stack>
      <WButton onClick={() => onSaveButtonClick(name, content)}>Save</WButton>
    </>
  );
};

export const ItemModal = ({
  project,
  item,
  onItemChange,
  onClose
}: {
  project: KanbanProject;
  item: { i: number; j: number };
  onItemChange: (name: string, content: string) => void;
  onClose: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const kanbanItem = project.columns[item.i].items[item.j];
  return (
    <WModal open={true} onClose={onClose}>
      {isEditing ? (
        <Edit
          kanbanItem={kanbanItem}
          onSaveButtonClick={(name, content) => {
            onItemChange(name, content);
            setIsEditing(false);
          }}
        />
      ) : (
        <View kanbanItem={kanbanItem} onEditButtonClick={() => setIsEditing(true)} />
      )}
    </WModal>
  );
};
