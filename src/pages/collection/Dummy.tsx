import { Checkbox, Stack } from "@mui/material";
import { TextInput } from "../../components/TextInput";
import { WText } from "../../components/WText";
import { SelectInput } from "../../components/SelectInput";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WButton } from "../../components/WButton";
import { CollectionAttributes, Folder } from "../../services/Types";
import { WModal } from "../../components/WModal";

const options = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" }
];

export const Dummy = ({
  open,
  setOpen,
  selectedFolder,
  updateFolderAttributes
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
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
    <WModal open={open} onClose={() => setOpen(false)}>
      <WText
        text="Attributes"
        editable={false}
        rightButtons={[
          {
            label: "Add",
            onClick: () => {
              if (!attributes) {
                return;
              }
              setAttributes([...attributes, { name: "", type: "text" }]);
            }
          },
          {
            label: "Delete",
            onClick: () => {
              setAttributes(attributes.filter((_, i) => !checkboxStatus.has(i)));
              setCheckboxStatus(new Set());
            }
          }
        ]}
      />
      {attributes.map(({ name, type }, i) => {
        return (
          <Stack key={`attribute-${i}`} sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
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
            <Stack>
              <Checkbox
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
            </Stack>
          </Stack>
        );
      })}
      <WButton onClick={async () => await updateFolderAttributes(attributes)}>Save</WButton>
    </WModal>
  );
};
