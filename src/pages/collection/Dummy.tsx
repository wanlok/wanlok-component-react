import { Stack } from "@mui/material";
import { TextInput } from "../../components/TextInput";
import { WText } from "../../components/WText";
import { SelectInput } from "../../components/SelectInput";
import { Dispatch } from "react";
import { WButton } from "../../components/WButton";

export interface Aaa {
  name: string;
  type: string;
}

export const Dummy = ({
  attributes,
  setAttributes
}: {
  attributes: Aaa[];
  setAttributes: Dispatch<React.SetStateAction<Aaa[]>>;
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
            onClick: () => setAttributes([...attributes, { name: "", type: "text" }])
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
          console.log("Hello World");
        }}
      >
        Save
      </WButton>
    </>
  );
};
