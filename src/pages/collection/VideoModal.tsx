import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { ViewList as ViewListIcon, SmartDisplay as SmartDisplayIcon } from "@mui/icons-material";
import { WModal } from "../../components/WModal";
import { TextInput } from "../../components/TextInput";
import { StyledContainer } from "../../components/StyledContainer";
import { YesNoButtons } from "../../components/YesNoButtons";

export const VideoModal = ({
  open,
  id,
  name,
  attributes,
  folderAttributes,
  onSaveButtonClick,
  onClose
}: {
  open: boolean;
  id: string;
  name: string;
  attributes: { [key: string]: string };
  folderAttributes: { name: string }[];
  onSaveButtonClick: (name: string, attributes: { [key: string]: string }) => void;
  onClose: () => void;
}) => {
  const [editedName, setEditedName] = useState(name);
  const [editedAttributes, setEditedAttributes] = useState<{ [key: string]: string }>(attributes);
  const [mobileSelectedTab, setMobileSelectedTab] = useState(0);

  useEffect(() => {
    if (open) {
      setEditedName(name);
      setEditedAttributes(attributes);
      setMobileSelectedTab(0);
    }
  }, [open, name, attributes]);

  return (
    <WModal
      open={open}
      onClose={onClose}
      width="80vw"
      height="80dvh"
      tabs={[{ icon: <SmartDisplayIcon sx={{ fontSize: 24 }} />, label: "Video" }]}
      hideLeftLabel
      mobileSelectedTab={mobileSelectedTab}
      onMobileSelectedTabChange={setMobileSelectedTab}
      rightTabs={[{ icon: <ViewListIcon sx={{ fontSize: 24 }} />, label: "Details" }]}
      rightBottom={
        <YesNoButtons
          yesLabel="Save"
          onYesClick={() => {
            onSaveButtonClick(editedName, editedAttributes);
            onClose();
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
      rightChildren={
        <Stack sx={{ p: 2, gap: 2 }}>
          <Stack sx={{ gap: "1px" }}>
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
        </Stack>
      }
    >
      {open && (
        <Box
          component="iframe"
          src={`https://www.youtube.com/embed/${id}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          sx={{ display: "block", width: "100%", height: "100%", border: 0 }}
        />
      )}
    </WModal>
  );
};
