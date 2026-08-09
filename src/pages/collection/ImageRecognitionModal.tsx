import { useEffect, useRef, useState } from "react";
import { Box, Stack } from "@mui/material";
import {
  Add as AddIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  ViewList as ViewListIcon
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { WModal } from "../../components/WModal";
import { iconButtonSx, WButton } from "../../components/WButton";
import { YesNoButtons } from "../../components/YesNoButtons";
import { TextInput } from "../../components/TextInput";
import { StyledContainer } from "../../components/StyledContainer";
import { ImageModalControlGroup, ImageModalTopControlGroup } from "../../components/ImageModalControlGroup";
import { useModalControlGroup } from "../../components/useModalControlGroup";
import { ImageRegionOverlay, TextRegion } from "./ImageRegionOverlay";
import { Recognitions, RecognitionsTop } from "./Recognitions";
import { useRecognitions } from "./useRecognitions";
import { ImageMetaContainer } from "../../components/ImageMetaContainer";
import { ImageMeta } from "../../services/Types";

const Details = ({
  editedName,
  onEditedNameChange,
  editedAttributes,
  onEditedAttributesChange,
  folderAttributes,
  imageMeta
}: {
  editedName: string;
  onEditedNameChange: (name: string) => void;
  editedAttributes: { [key: string]: string };
  onEditedAttributesChange: (attributes: { [key: string]: string }) => void;
  folderAttributes: { name: string }[];
  imageMeta: ImageMeta | undefined;
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
    <ImageMetaContainer imageMeta={imageMeta} />
  </Stack>
);

export const ImageRecognitionModal = ({
  open,
  src,
  name,
  attributes,
  layout,
  textRegions,
  folderAttributes,
  type,
  onPreviousClick,
  onNextClick,
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
  type: string;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onSaveButtonClick: (
    name: string,
    attributes: { [key: string]: string },
    layout: string,
    textRegions: TextRegion[]
  ) => void;
  onClose: () => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const navigate = useNavigate();
  const { id: folderId, itemId, tab } = useParams();
  const [editedName, setEditedName] = useState(name);
  const [editedAttributes, setEditedAttributes] = useState<{ [key: string]: string }>(attributes);
  const [desktopSelectedTab, setDesktopSelectedTab] = useState(tab === "recognitions" ? 1 : 0);
  const [mobileSelectedTab, setMobileSelectedTab] = useState(tab === "recognitions" ? 2 : 0);
  const [zoom, setZoom] = useState("fit");
  const { isFullScreen, onFullScreenClick, exitFullScreen, isRightHidden, onDetailsClick } = useModalControlGroup();
  const [scrollbarWidths, setScrollbarWidths] = useState({ bottom: 0, right: 0 });
  const [imageMeta, setImageMeta] = useState<ImageMeta | undefined>(undefined);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const rightHidden = mobile ? false : isRightHidden;

  useEffect(() => {
    const element = imageScrollRef.current;
    if (!element) {
      return;
    }
    const updateScrollbarWidths = () => {
      setScrollbarWidths({
        bottom: element.offsetHeight - element.clientHeight,
        right: element.offsetWidth - element.clientWidth
      });
    };
    updateScrollbarWidths();
    const resizeObserver = new ResizeObserver(updateScrollbarWidths);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [zoom]);

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

  const closeModal = () => {
    exitFullScreen();
    onClose();
  };

  const rightTabs = [
    { icon: <ViewListIcon sx={{ fontSize: 24 }} />, label: "Details" },
    { icon: <VisibilityIcon sx={{ fontSize: 28 }} />, label: "Recognitions" }
  ];

  return (
    <WModal
      open={open}
      onClose={closeModal}
      width="80vw"
      height="80dvh"
      isFullScreen={isFullScreen}
      tabs={[{ icon: <ImageIcon sx={{ fontSize: 24 }} />, label: "Image" }]}
      hideLeftLabel
      top={
        mobile ? (
          <>
            <WButton onClick={onAddRegionClick} sx={iconButtonSx}>
              <AddIcon sx={{ fontSize: 24 }} />
            </WButton>
            <ImageModalTopControlGroup
              onZoomInClick={() => setZoom("original")}
              onZoomOutClick={() => setZoom("fit")}
            />
          </>
        ) : undefined
      }
      rightTabs={rightHidden ? undefined : rightTabs}
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
        !rightHidden && desktopSelectedTab === 1 ? (
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
        rightHidden ? undefined : (
          <YesNoButtons
            yesLabel="Save"
            onYesClick={() => {
              onSaveButtonClick(editedName, editedAttributes, selectedLayout, regions);
              closeModal();
            }}
            noLabel="Cancel"
            onNoClick={closeModal}
          />
        )
      }
      rightChildren={
        rightHidden ? undefined : desktopSelectedTab === 0 ? (
          <Details
            editedName={editedName}
            onEditedNameChange={setEditedName}
            editedAttributes={editedAttributes}
            onEditedAttributesChange={setEditedAttributes}
            folderAttributes={folderAttributes}
            imageMeta={imageMeta}
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
          fullScreen={mobile || isFullScreen}
          selectedId={selectedRegionId}
          onSelectedIdChange={onRegionSelect}
          onImageLoad={(size) => {
            setImageMeta({ ...size, type });
            const element = imageScrollRef.current;
            if (element) {
              setScrollbarWidths({
                bottom: element.offsetHeight - element.clientHeight,
                right: element.offsetWidth - element.clientWidth
              });
            }
          }}
        />
        {!mobile && (
          <ImageModalControlGroup
            onZoomInClick={() => setZoom("original")}
            onZoomOutClick={() => setZoom("fit")}
            isFullScreen={isFullScreen}
            onFullScreenClick={onFullScreenClick}
            isRightHidden={isRightHidden}
            onDetailsClick={onDetailsClick}
            tabs={rightTabs}
            selectedTab={desktopSelectedTab}
            onPreviousClick={onPreviousClick}
            onNextClick={onNextClick}
            scrollbarWidths={scrollbarWidths}
          />
        )}
      </Box>
    </WModal>
  );
};
