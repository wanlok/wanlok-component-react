import { Stack } from "@mui/material";
import { StyledContainer } from "../../components/StyledContainer";
import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";
import { useEffect, useState } from "react";
import { WButton } from "../../components/WButton";
import { CollectionAttributes, Folder } from "../../services/Types";
import { WCheckbox } from "../../components/WCheckbox";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";
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
    if (open && selectedFolder) {
      setAttributes([...selectedFolder.attributes.map((attribute) => ({ ...attribute }))]);
      setCheckboxStatus(new Set());
    }
  }, [open, selectedFolder]);

  return (
    <WModal
      open={open}
      onClose={onClose}
      titleIcon={<EditIcon sx={{ fontSize: 18, mt: "-2px" }} />}
      title="Edit Attributes"
      top={
        <>
          <WButton
            onClick={() => {
              if (!attributes) {
                return;
              }
              setAttributes([...attributes, { name: "", type: "text" }]);
            }}
            rightIcon={<AddIcon sx={{ fontSize: 24 }} />}
          >
            Add Row
          </WButton>
          {checkboxStatus.size > 0 && (
            <WButton
              onClick={() => {
                setAttributes(attributes.filter((_, i) => !checkboxStatus.has(i)));
                setCheckboxStatus(new Set());
              }}
              rightIcon={<CloseIcon sx={{ fontSize: 24 }} />}
            >
              {`Delete ${checkboxStatus.size} ${checkboxStatus.size === 1 ? "Row" : "Rows"}`}
            </WButton>
          )}
        </>
      }
      bottom={
        <YesNoButtons
          yesLabel="Save"
          onYesClick={async () => {
            await updateFolderAttributes(attributes);
            onClose();
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
    >
      <Stack sx={{ gap: "1px" }}>
        {attributes.map(({ name, type }, i) => {
          return (
            <StyledContainer key={`attribute-${i}`} sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
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
                <WCheckbox
                  checked={checkboxStatus.has(i)}
                  onChange={(checked) => {
                    const newCheckboxStatus = new Set(checkboxStatus);
                    if (checked) {
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
            </StyledContainer>
          );
        })}
      </Stack>
    </WModal>
  );
};
