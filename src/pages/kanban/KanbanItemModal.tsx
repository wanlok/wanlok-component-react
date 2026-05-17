import { useState } from "react";
import { Divider, Stack } from "@mui/material";
import { WModal } from "../../components/WModal";
import { WText } from "../../components/WText";
import { KanbanProject } from "../../services/Types";
import { WButton } from "../../components/WButton";
import { TextInput } from "../../components/TextInput";
import { getDisplayDateTimeString } from "../../common/DateUtils";

export const KanbanItemModal = ({
  project,
  item,
  onItemChange,
  onDeleteButtonClick,
  onClose
}: {
  project: KanbanProject;
  item: { i: number; j: number };
  onItemChange: (name: string, content: string) => void;
  onDeleteButtonClick: () => void;
  onClose: () => void;
}) => {
  const { name: initialName, content: initialContent, created_at } = project.columns[item.i].items[item.j];
  const [name, setName] = useState(initialName);
  const [content, setContent] = useState(initialContent);
  return (
    <WModal open={true} onClose={onClose}>
      <WText text="Edit Task" editable={false} rightButtons={[]} />
      <Divider />
      <Stack sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
        <Stack sx={{ flex: 1, gap: 1, p: 1 }}>
          <TextInput label="Name" value={name} onChange={setName} hideHelperText={true} inputPropsSx={{ flex: 1 }} />
          <TextInput
            label="Creation Date/Time"
            value={getDisplayDateTimeString(new Date(created_at))}
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
      <Stack sx={{ flexDirection: "row", gap: "1px" }}>
        <WButton sx={{ flex: 1 }} onClick={onDeleteButtonClick}>
          Delete
        </WButton>
        <WButton
          sx={{ flex: 1 }}
          onClick={() => {
            onItemChange(name, content);
            onClose();
          }}
        >
          Save
        </WButton>
      </Stack>
    </WModal>
  );
};
