import { Divider, Stack, Typography } from "@mui/material";
import { StyledContainer } from "../../components/StyledContainer";
import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";
import { useState } from "react";
import { iconButtonSx, WButton } from "../../components/WButton";
import { CollectionAttributes, Folder } from "../../services/Types";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";
import { Add as AddIcon, Close as CloseIcon, Edit as EditIcon } from "@mui/icons-material";

const options = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" }
];

export const FolderModal = ({
  open,
  onClose,
  selectedFolder,
  updateFolderAttributes
}: {
  open: boolean;
  onClose: () => void;
  selectedFolder?: Folder;
  updateFolderAttributes: (folderName: string, attributes: CollectionAttributes) => Promise<void>;
}) => {
  const [folderName, setFolderName] = useState(selectedFolder?.name ?? "");
  const [attributes, setAttributes] = useState<CollectionAttributes>(
    selectedFolder ? selectedFolder.attributes.map((attribute) => ({ ...attribute })) : []
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const nameCounts = new Map<string, number[]>();
  attributes.forEach(({ name }, i) => {
    if (name) {
      if (!nameCounts.has(name)) {
        nameCounts.set(name, []);
      }
      nameCounts.get(name)!.push(i);
    }
  });
  const duplicateIndices = new Set<number>();
  nameCounts.forEach((indices) => {
    if (indices.length > 1) {
      indices.forEach((i) => duplicateIndices.add(i));
    }
  });

  return (
    <WModal
      open={open}
      onClose={onClose}
      tabs={[{ icon: <EditIcon sx={{ fontSize: 18, mt: -0.1 }} />, label: "Edit Folder" }]}
      bottom={
        <YesNoButtons
          yesLabel="Save"
          yesDisabled={duplicateIndices.size > 0}
          onYesClick={async () => {
            await updateFolderAttributes(folderName, attributes);
            onClose();
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
    >
      <Stack sx={{ gap: 2, p: 2 }}>
        <StyledContainer sx={{ p: 1 }}>
          <TextInput label="Name" value={folderName} onChange={(value) => setFolderName(value)} inputSx={{ flex: 1 }} />
        </StyledContainer>
        <Divider />
        <Stack sx={{ gap: 1 }}>
          <Stack sx={{ flexDirection: "row", gap: "1px" }}>
            <Typography variant="body1" sx={{ flex: 1, alignSelf: "center" }}>
              {`Attributes (${attributes.length})`}
            </Typography>
            <WButton
              onClick={() => {
                if (!attributes) {
                  return;
                }
                setAttributes([...attributes, { name: "", type: "text" }]);
              }}
              sx={iconButtonSx}
            >
              <AddIcon sx={{ fontSize: 26 }} />
            </WButton>
            <WButton isActivated={isDeleting} onClick={() => setIsDeleting(!isDeleting)} sx={iconButtonSx}>
              <CloseIcon sx={{ fontSize: 24 }} />
            </WButton>
          </Stack>
          <Stack sx={{ gap: "1px" }}>
            {attributes.map(({ name, type }, i) => (
              <StyledContainer
                key={`attribute-${i}`}
                isError={duplicateIndices.has(i)}
                sx={{ flexDirection: "row", gap: 1 }}
              >
                <Stack
                  sx={{
                    flex: 1,
                    flexDirection: "row",
                    py: 1,
                    pr: isDeleting ? 0 : 1
                  }}
                >
                  <Stack sx={{ pt: 1, width: 32, textAlign: "center" }}>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      {i + 1}
                    </Typography>
                  </Stack>
                  <Stack sx={{ flex: 1, gap: 1 }}>
                    <TextInput
                      placeholder="Attribute Name"
                      value={name}
                      onChange={(value) => {
                        const newAttributes = [...attributes];
                        newAttributes[i].name = value;
                        setAttributes(newAttributes);
                      }}
                      inputSx={{ flex: 1 }}
                    />
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
                {isDeleting && (
                  <WButton onClick={() => setAttributes(attributes.filter((_, j) => j !== i))} sx={iconButtonSx}>
                    <CloseIcon sx={{ fontSize: 24 }} />
                  </WButton>
                )}
              </StyledContainer>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </WModal>
  );
};
