import { useRef, useState } from "react";
import { alpha, Box, Stack } from "@mui/material";
import {
  Add as AddIcon,
  CropFree as CropFreeIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Image as ImageIcon,
  ViewList as ViewListIcon
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { WModal } from "../../components/WModal";
import { iconButtonSx, WButton } from "../../components/WButton";
import { YesNoButtons } from "../../components/YesNoButtons";
import { TextInput } from "../../components/TextInput";
import { StyledContainer } from "../../components/StyledContainer";
import { ImageRegionOverlay, TextRegion } from "./ImageRegionOverlay";
import { Recognitions, RecognitionsTop } from "./Recognitions";
import { useRecognitions } from "./useRecognitions";

const Details = ({
  editedName,
  onEditedNameChange,
  editedAttributes,
  onEditedAttributesChange,
  folderAttributes
}: {
  editedName: string;
  onEditedNameChange: (name: string) => void;
  editedAttributes: { [key: string]: string };
  onEditedAttributesChange: (attributes: { [key: string]: string }) => void;
  folderAttributes: { name: string }[];
}) => (
  <Stack sx={{ p: 2, gap: 2 }}>
    <Stack sx={{ gap: "1px" }}>
      <StyledContainer sx={{ p: 1 }}>
        <TextInput label="Name" value={editedName} onChange={onEditedNameChange} inputSx={{ flex: 1 }} />
      </StyledContainer>
      {folderAttributes.map(({ name: attributeName }, i) => (
        <StyledContainer key={`attribute-${i}`} sx={{ p: 1 }}>
          <TextInput
            label={attributeName}
            value={editedAttributes[attributeName] ?? ""}
            onChange={(value) => onEditedAttributesChange({ ...editedAttributes, [attributeName]: value })}
            inputSx={{ flex: 1 }}
          />
        </StyledContainer>
      ))}
    </Stack>
  </Stack>
);

export const ImageModal = ({
  open,
  src,
  name,
  attributes,
  layout,
  textRegions,
  folderAttributes,
  onSaveButtonClick,
  onClose
}: {
  open: boolean;
  src: string;
  name: string;
  attributes: { [key: string]: string };
  layout: string;
  textRegions: TextRegion[];
  folderAttributes: { name: string }[];
  onSaveButtonClick: (
    name: string,
    attributes: { [key: string]: string },
    layout: string,
    textRegions: TextRegion[]
  ) => void;
  onClose: () => void;
}) => {
  const { breakpoints, palette } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const navigate = useNavigate();
  const { id: folderId, itemId, tab } = useParams();
  const [editedName, setEditedName] = useState(name);
  const [editedAttributes, setEditedAttributes] = useState<{ [key: string]: string }>(attributes);
  const [desktopSelectedTab, setDesktopSelectedTab] = useState(tab === "recognitions" ? 1 : 0);
  const [mobileSelectedTab, setMobileSelectedTab] = useState(tab === "recognitions" ? 2 : 0);
  const [zoom, setZoom] = useState("fit");
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  const {
    regions,
    setRegions,
    selectedLayout,
    controlGroupState,
    setControlGroupState,
    selectedRegionId,
    translatingRegionIds,
    onAddRegionClick,
    onRegionMouseUp,
    onRegionLanguageChange,
    onRegionTextChange,
    onRegionTextBlur,
    onLayoutIndexChange,
    onRegionTypeChange,
    onRegionDelimiterChange,
    onRegionCorrectAnswerIndicesChange,
    onRegionTranslateLanguageChange,
    onRegionSelect,
    onRegionAvatarClick
  } = useRecognitions({
    open,
    src,
    layout,
    textRegions,
    imageScrollRef,
    rightScrollRef,
    onRegionSelected: () => {
      if (mobile) {
        setMobileSelectedTab(0);
      }
    }
  });

  return (
    <WModal
      open={open}
      onClose={onClose}
      width="80vw"
      height="80dvh"
      tabs={[{ icon: <ImageIcon sx={{ fontSize: 24 }} />, label: "Image" }]}
      hideLeftLabel
      top={
        mobile ? (
          <>
            <WButton onClick={onAddRegionClick} sx={iconButtonSx}>
              <AddIcon sx={{ fontSize: 24 }} />
            </WButton>
            <WButton onClick={() => setZoom("original")} sx={iconButtonSx}>
              <ZoomInIcon sx={{ fontSize: 24 }} />
            </WButton>
            <WButton onClick={() => setZoom("fit")} sx={iconButtonSx}>
              <ZoomOutIcon sx={{ fontSize: 24 }} />
            </WButton>
          </>
        ) : undefined
      }
      rightTabs={[
        { icon: <ViewListIcon sx={{ fontSize: 24 }} />, label: "Details" },
        { icon: <CropFreeIcon sx={{ fontSize: 24 }} />, label: "Recognitions" }
      ]}
      rightSelectedTab={desktopSelectedTab}
      onRightTabChange={(newTab) => {
        setDesktopSelectedTab(newTab);
        setControlGroupState(0);
        if (folderId && itemId) {
          navigate(`/collections/${folderId}/${itemId}/${newTab === 1 ? "recognitions" : "details"}`, {
            replace: true
          });
        }
      }}
      mobileSelectedTab={mobileSelectedTab}
      onMobileSelectedTabChange={(newTab) => {
        setMobileSelectedTab(newTab);
        if (folderId && itemId) {
          navigate(`/collections/${folderId}/${itemId}/${newTab === 2 ? "recognitions" : "details"}`, {
            replace: true
          });
        }
      }}
      rightTop={
        desktopSelectedTab === 1 ? (
          <RecognitionsTop
            selectedLayout={selectedLayout}
            controlGroupState={controlGroupState}
            onLayoutChange={onLayoutIndexChange}
            onAddRegionClick={onAddRegionClick}
            onRearrangeButtonClick={() => setControlGroupState(controlGroupState === 1 ? 0 : 1)}
            onDeleteButtonClick={() => setControlGroupState(controlGroupState === 2 ? 0 : 2)}
          />
        ) : undefined
      }
      rightScrollRef={rightScrollRef}
      rightBottom={
        <YesNoButtons
          yesLabel="Save"
          onYesClick={() => {
            onSaveButtonClick(editedName, editedAttributes, selectedLayout, regions);
            onClose();
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
      rightChildren={
        desktopSelectedTab === 0 ? (
          <Details
            editedName={editedName}
            onEditedNameChange={setEditedName}
            editedAttributes={editedAttributes}
            onEditedAttributesChange={setEditedAttributes}
            folderAttributes={folderAttributes}
          />
        ) : (
          <Recognitions
            regions={regions}
            onRegionsChange={setRegions}
            selectedLayout={selectedLayout}
            controlGroupState={controlGroupState}
            selectedRegionId={selectedRegionId}
            onRegionAvatarClick={onRegionAvatarClick}
            onRegionTypeChange={onRegionTypeChange}
            onRegionLanguageChange={onRegionLanguageChange}
            onRegionTextChange={onRegionTextChange}
            onRegionTextBlur={onRegionTextBlur}
            onRegionTranslateLanguageChange={onRegionTranslateLanguageChange}
            onRegionDelimiterChange={onRegionDelimiterChange}
            onRegionCorrectAnswerIndicesChange={onRegionCorrectAnswerIndicesChange}
            translatingRegionIds={translatingRegionIds}
          />
        )
      }
    >
      <Box sx={{ position: "relative", height: "100%" }}>
        <ImageRegionOverlay
          src={src}
          alt={name}
          regions={mobile || desktopSelectedTab === 1 ? regions : []}
          onRegionsChange={setRegions}
          onRegionMouseUp={onRegionMouseUp}
          scrollRef={imageScrollRef}
          fitScreen={zoom === "fit"}
          selectedId={selectedRegionId}
          onSelectedIdChange={onRegionSelect}
        />
        {!mobile && (
          <Stack sx={{ position: "absolute", flexDirection: "row", top: 8, left: 8, gap: "1px" }}>
            <WButton
              onClick={() => setZoom("original")}
              sx={{
                ...iconButtonSx,
                backgroundColor: alpha(palette.primary.main, 0.9),
                "&:hover": { backgroundColor: palette.primary.main }
              }}
            >
              <ZoomInIcon sx={{ fontSize: 28 }} />
            </WButton>
            <WButton
              onClick={() => setZoom("fit")}
              sx={{
                ...iconButtonSx,
                backgroundColor: alpha(palette.primary.main, 0.9),
                "&:hover": { backgroundColor: palette.primary.main }
              }}
            >
              <ZoomOutIcon sx={{ fontSize: 28 }} />
            </WButton>
          </Stack>
        )}
      </Box>
    </WModal>
  );
};
