import { Stack } from "@mui/material";
import { TextInput } from "../../components/TextInput";
import { WText } from "../../components/WText";
import { SelectInput } from "../../components/SelectInput";
import { useEffect, useState } from "react";
import { WButton } from "../../components/WButton";
import { CollectionAttributes, Folder } from "../../services/Types";

const options = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" }
];

export const Dummy = ({
  selectedFolder,
  updateFolderAttributes
}: {
  selectedFolder: Folder;
  updateFolderAttributes: (attributes: CollectionAttributes) => Promise<void>;
}) => {
  const [attributes, setAttributes] = useState<CollectionAttributes>([]);

  useEffect(() => {
    setAttributes([...selectedFolder.attributes.map((attribute) => ({ ...attribute }))]);
  }, [selectedFolder]);

  return (
    <>
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
          </Stack>
        );
      })}
      <WButton
        onClick={() => {
          updateFolderAttributes(attributes);
        }}
      >
        Save
      </WButton>
    </>
  );
};
