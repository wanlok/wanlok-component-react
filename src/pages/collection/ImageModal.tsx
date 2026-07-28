import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { WModal, WModalContent } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";
import { TextInput } from "../../components/TextInput";
import { StyledContainer } from "../../components/StyledContainer";

export const ImageModal = ({
  open,
  src,
  name,
  attributes,
  folderAttributes,
  onSaveButtonClick,
  onClose
}: {
  open: boolean;
  src: string;
  name: string;
  attributes: { [key: string]: string };
  folderAttributes: { name: string }[];
  onSaveButtonClick: (name: string, attributes: { [key: string]: string }) => void;
  onClose: () => void;
}) => {
  const [tab, setTab] = useState(0);
  const [editedName, setEditedName] = useState(name);
  const [editedAttributes, setEditedAttributes] = useState<{ [key: string]: string }>(attributes);

  useEffect(() => {
    if (open) {
      setTab(0);
      setEditedName(name);
      setEditedAttributes(attributes);
    }
  }, [open, name, attributes]);

  return (
    <WModal
      open={open}
      onClose={onClose}
      width="80vw"
      rightTabs={[{ label: "Edit Image" }, { label: "Recognition" }]}
      rightTab={tab}
      onRightTabChange={setTab}
      right={
        <WModalContent
          bottom={
            tab === 0 ? (
              <YesNoButtons
                yesLabel="Save"
                onYesClick={() => {
                  onSaveButtonClick(editedName, editedAttributes);
                  onClose();
                }}
                noLabel="Cancel"
                onNoClick={onClose}
              />
            ) : undefined
          }
        >
          {tab === 0 ? (
            <Stack sx={{ p: 2, gap: "1px" }}>
              <StyledContainer sx={{ p: 1 }}>
                <TextInput label="Name" value={editedName} onChange={setEditedName} inputPropsSx={{ flex: 1 }} />
              </StyledContainer>
              {folderAttributes.map(({ name: attributeName }, i) => (
                <StyledContainer key={`attribute-${i}`} sx={{ p: 1 }}>
                  <TextInput
                    label={attributeName}
                    value={editedAttributes[attributeName] ?? ""}
                    onChange={(value) => setEditedAttributes({ ...editedAttributes, [attributeName]: value })}
                    inputPropsSx={{ flex: 1 }}
                  />
                </StyledContainer>
              ))}
            </Stack>
          ) : (
            <Stack />
          )}
        </WModalContent>
      }
    >
      <Stack sx={{ height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "common.black" }}>
        <Box component="img" src={src} alt={name} sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      </Stack>
    </WModal>
  );
};
