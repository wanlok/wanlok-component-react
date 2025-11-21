import { Stack } from "@mui/material";
import { TextInput } from "../../components/TextInput";
import { WText } from "../../components/WText";
import { SelectInput } from "../../components/SelectInput";
import { Dispatch, SetStateAction } from "react";
import { WButton } from "../../components/WButton";
import { CollectionAttributes } from "../../services/Types";

export const Dummy = ({
  attributes,
  setAttributes,
  updateFolderAttributes
}: {
  attributes: CollectionAttributes;
  setAttributes: Dispatch<SetStateAction<CollectionAttributes>>;
  updateFolderAttributes: (attributes: CollectionAttributes) => Promise<void>;
}) => {
  const options = [
    { label: "Text", value: "text" },
    { label: "Number", value: "number" }
  ];
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
      {attributes.map(({ name, type }, index) => {
        return (
          <Stack sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
            <Stack sx={{ flex: 1 }}>
              <TextInput
                value={name}
                onChange={(value) => {
                  setAttributes((prev) => {
                    const newAttributes = [...prev];
                    newAttributes[index].name = value;
                    return newAttributes;
                  });
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
                  setAttributes((prev) => {
                    const newAttributes = [...prev];
                    newAttributes[index].type = value;
                    return newAttributes;
                  });
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
