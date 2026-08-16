import { useState } from "react";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ViewList as ViewListIcon, YouTube as YouTubeIcon } from "@mui/icons-material";
import { WModal } from "../../components/WModal";
import { TextInput } from "../../components/TextInput";
import { StyledContainer } from "../../components/StyledContainer";
import { WButton } from "../../components/WButton";
import { YesNoButtons } from "../../components/YesNoButtons";
import { ModalControlGroup } from "../../components/ModalControlGroup";
import { useModalControlGroup } from "../../components/useModalControlGroup";

export const YouTubeModal = ({
  open,
  id,
  name,
  attributes,
  folderAttributes,
  onPreviousClick,
  onNextClick,
  onSaveButtonClick,
  onClose
}: {
  open: boolean;
  id: string;
  name: string;
  attributes: { [key: string]: string };
  folderAttributes: { name: string }[];
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onSaveButtonClick: (name: string, attributes: { [key: string]: string }) => void;
  onClose: () => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const [editedAttributes, setEditedAttributes] = useState<{ [key: string]: string }>(attributes);
  const [mobileSelectedPage, setMobileSelectedPage] = useState(0);
  const { isFullScreen, onFullScreenClick, exitFullScreen, isRightHidden, onDetailsClick } = useModalControlGroup();

  const closeModal = () => {
    exitFullScreen();
    onClose();
  };

  const rightPages = [{ icon: <ViewListIcon sx={{ fontSize: 24 }} />, label: "Details" }];

  return (
    <WModal
      open={open}
      onClose={closeModal}
      width="80vw"
      isFullScreen={isFullScreen}
      pages={[{ icon: <YouTubeIcon sx={{ fontSize: 24 }} />, label: "Video" }]}
      hideLeftLabel
      bottom={
        mobile ? (
          <WButton onClick={closeModal} sx={{ flex: 1 }}>
            Cancel
          </WButton>
        ) : undefined
      }
      mobileSelectedPage={mobileSelectedPage}
      onMobileSelectedPageChange={setMobileSelectedPage}
      rightPages={isRightHidden ? undefined : rightPages}
      rightBottom={
        isRightHidden ? undefined : (
          <YesNoButtons
            yesLabel="Save"
            onYesClick={() => {
              onSaveButtonClick(name, editedAttributes);
              closeModal();
            }}
            noLabel="Cancel"
            onNoClick={closeModal}
          />
        )
      }
      rightChildren={
        isRightHidden ? undefined : (
          <Stack sx={{ p: 2, gap: 2 }}>
            <Stack sx={{ gap: "1px" }}>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body1">{name}</Typography>
              </Stack>
              {folderAttributes.map(({ name: attributeName }, i) => (
                <StyledContainer key={`attribute-${i}`} sx={{ p: 1 }}>
                  <TextInput
                    label={attributeName}
                    value={editedAttributes[attributeName] ?? ""}
                    onChange={(value) => setEditedAttributes({ ...editedAttributes, [attributeName]: value })}
                    inputSx={{ flex: 1 }}
                  />
                </StyledContainer>
              ))}
            </Stack>
          </Stack>
        )
      }
    >
      {open && (
        <Box sx={{ position: "relative", height: "100%" }}>
          <Stack
            sx={{ height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "common.black" }}
          >
            <Box
              component="iframe"
              src={`https://www.youtube.com/embed/${id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              sx={{ display: "block", height: "100%", maxWidth: "100%", aspectRatio: "16/9", border: 0 }}
            />
          </Stack>
          {!mobile && (
            <ModalControlGroup
              isFullScreen={isFullScreen}
              onFullScreenClick={onFullScreenClick}
              isRightHidden={isRightHidden}
              onDetailsClick={onDetailsClick}
              pages={rightPages}
              selectedPage={0}
              onPreviousClick={onPreviousClick}
              onNextClick={onNextClick}
            />
          )}
        </Box>
      )}
    </WModal>
  );
};
