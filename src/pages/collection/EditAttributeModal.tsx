import { Checkbox, Stack, Typography } from "@mui/material";
import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";
import { useEffect, useState } from "react";
import { WButton } from "../../components/WButton";
import { CollectionAttributes, Folder } from "../../services/Types";
import { WModal } from "../../components/WModal";
import { Add as AddIcon, Close as CloseIcon, Edit as EditIcon } from "@mui/icons-material";

const options = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" }
];

export const EditAttributeModal = ({
  open,
  onClose,
  selectedFolder,
  updateFolderAttributes
}: {
  open: boolean;
  onClose: () => void;
  selectedFolder?: Folder;
  updateFolderAttributes: (attributes: CollectionAttributes) => Promise<void>;
}) => {
  const [attributes, setAttributes] = useState<CollectionAttributes>([]);
  const [checkboxStatus, setCheckboxStatus] = useState(new Set<number>());

  useEffect(() => {
    if (selectedFolder) {
      setAttributes([...selectedFolder.attributes.map((attribute) => ({ ...attribute }))]);
      setCheckboxStatus(new Set());
    }
  }, [selectedFolder]);

  return (
    <WModal open={open} onClose={onClose}>
      <Stack sx={{ flexDirection: "row", alignItems: "center", p: 2, gap: 1 }}>
        <EditIcon sx={{ fontSize: 18, mt: "-2px" }} />
        <Typography>Edit Attributes</Typography>
      </Stack>
      <Stack sx={{ flexDirection: "row", gap: "1px", height: 55 }}>
        <WButton
          onClick={() => {
            if (!attributes) {
              return;
            }
            setAttributes([...attributes, { name: "", type: "text" }]);
          }}
          rightIcon={<AddIcon sx={{ fontSize: 24 }} />}
        >
          Add
        </WButton>
        <WButton
          onClick={() => {
            setAttributes(attributes.filter((_, i) => !checkboxStatus.has(i)));
            setCheckboxStatus(new Set());
          }}
          rightIcon={<CloseIcon sx={{ fontSize: 24 }} />}
        >
          Delete
        </WButton>
      </Stack>
      <Stack sx={{ p: 2, gap: "1px", backgroundColor: "common.white" }}>
        {attributes.map(({ name, type }, i) => {
          return (
            <Stack key={`attribute-${i}`} sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
              <Stack
                sx={{
                  flex: 1,
                  flexDirection: "row",
                  p: 1,
                  gap: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "background.default"
                }}
              >
                <Checkbox
                  sx={{ p: 0, color: "divider", "&.Mui-checked": { color: "common.black" } }}
                  checked={checkboxStatus.has(i)}
                  onChange={(event) => {
                    const newCheckboxStatus = new Set(checkboxStatus);
                    if (event.target.checked) {
                      newCheckboxStatus.add(i);
                    } else {
                      newCheckboxStatus.delete(i);
                    }
                    setCheckboxStatus(newCheckboxStatus);
                  }}
                />
                <Stack sx={{ flex: 1 }}>
                  <TextInput
                    value={name}
                    onChange={(value) => {
                      const newAttributes = [...attributes];
                      newAttributes[i].name = value;
                      setAttributes(newAttributes);
                    }}
                    hideHelperText={true}
                    inputPropsSx={{ flex: 1 }}
                  />
                </Stack>
                <Stack sx={{ flex: 1 }}>
                  <SelectInput
                    items={options}
                    value={type}
                    onChange={(value: string) => {
                      if (value !== "text" && value !== "number") {
                        return;
                      }
                      const newAttributes = [...attributes];
                      newAttributes[i].type = value;
                      setAttributes(newAttributes);
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
      <WButton
        onClick={async () => {
          await updateFolderAttributes(attributes);
          onClose();
        }}
        sx={{ height: 55 }}
      >
        Save
      </WButton>
    </WModal>
  );
};
