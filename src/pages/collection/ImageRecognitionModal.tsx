import { useEffect, useRef, useState } from "react";
import { Box, Stack } from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
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
import { ImageRegionOverlay, Region } from "./ImageRegionOverlay";
import { LAYOUT_ITEMS, Recognitions, RecognitionsTop } from "./Recognitions";
import { useRecognitions } from "./useRecognitions";
import { ImageMetaContainer } from "../../components/ImageMetaContainer";
import { ImageMeta } from "../../services/Types";
import { SelectInput } from "../../components/SelectInput";

const PREVIEW_ALIGNMENT_ITEMS = [
  { label: "Top", value: "top" },
  { label: "Center", value: "center" },
  { label: "Bottom", value: "bottom" }
];

const Details = ({
  editedName,
  onEditedNameChange,
  src,
  editedPreviewAlignment,
  onEditedPreviewAlignmentChange,
  editedAttributes,
  onEditedAttributesChange,
  folderAttributes,
  imageMeta
}: {
  editedName: string;
  onEditedNameChange: (name: string) => void;
  src: string;
  editedPreviewAlignment: string;
  onEditedPreviewAlignmentChange: (previewAlignment: string) => void;
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
      <StyledContainer sx={{ flexDirection: "row", gap: 1, p: 1 }}>
        <Stack sx={{ flex: 1 }}>
          <SelectInput
            label="Preview Alignment"
            items={PREVIEW_ALIGNMENT_ITEMS}
            value={editedPreviewAlignment}
            onChange={onEditedPreviewAlignmentChange}
          />
        </Stack>
        <Stack sx={{ height: 64, aspectRatio: "16/9", position: "relative" }}>
          <Box
            component="img"
            src={src}
            alt=""
            sx={{
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: editedPreviewAlignment
            }}
          />
        </Stack>
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
  previewAlignment,
  attributes,
  layout,
  regions: initialRegions,
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
  previewAlignment: string;
  attributes: { [key: string]: string };
  layout: string;
  regions: Region[];
  folderAttributes: { name: string }[];
  type: string;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onSaveButtonClick: (
    name: string,
    previewAlignment: string,
    attributes: { [key: string]: string },
    layout: string,
    regions: Region[]
  ) => void;
  onClose: () => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const navigate = useNavigate();
  const { id: folderId, itemId, page } = useParams();
  const [editedName, setEditedName] = useState(name);
  const [editedPreviewAlignment, setEditedPreviewAlignment] = useState(previewAlignment);
  const [editedAttributes, setEditedAttributes] = useState<{ [key: string]: string }>(attributes);
  const [desktopSelectedPage, setDesktopSelectedPage] = useState(page === "recognitions" ? 1 : 0);
  const [mobileSelectedPage, setMobileSelectedPage] = useState(page === "recognitions" ? 2 : 0);
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
    selectedRegionIndex,
    translatingRegionIndices,
    autoExpandingRegionIndices,
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
    onRegionAvatarClick,
    onDeleteSelectedRegionClick,
    onAutoExpandRegionClick
  } = useRecognitions({
    open,
    src,
    layout,
    regions: initialRegions,
    imageScrollRef,
    rightScrollRef,
    mobile,
    onRegionSelected: () => {
      if (mobile) {
        setMobileSelectedPage(0);
      }
    }
  });

  const closeModal = () => {
    exitFullScreen();
    onClose();
  };

  const rightPages = [
    { icon: <ViewListIcon sx={{ fontSize: 24 }} />, label: "Details" },
    { icon: <VisibilityIcon sx={{ fontSize: 28, mt: "-2px" }} />, label: `Recognitions (${regions.length})` }
  ];

  const isPolygonEnabled = LAYOUT_ITEMS.find((item) => item.value === selectedLayout)?.isPolygonEnabled ?? false;

  return (
    <WModal
      open={open}
      onClose={closeModal}
      width="80vw"
      height="80dvh"
      isFullScreen={isFullScreen}
      pages={[{ icon: <ImageIcon sx={{ fontSize: 24 }} />, label: "Image" }]}
      hideLeftLabel
      top={
        mobile ? (
          <>
            <StyledContainer sx={{ flex: 1, p: 1 }}>
              <SelectInput items={LAYOUT_ITEMS} value={selectedLayout} onChange={onLayoutIndexChange} />
            </StyledContainer>
            <WButton onClick={onAddRegionClick} sx={iconButtonSx}>
              <AddIcon sx={{ fontSize: 26 }} />
            </WButton>
            <WButton onClick={onDeleteSelectedRegionClick} sx={iconButtonSx}>
              <CloseIcon sx={{ fontSize: 24 }} />
            </WButton>
          </>
        ) : undefined
      }
      bottom={
        mobile ? (
          <>
            <ImageModalTopControlGroup
              onAutoExpandButtonClick={
                isPolygonEnabled && selectedRegionIndex !== null
                  ? () => onAutoExpandRegionClick(selectedRegionIndex)
                  : undefined
              }
              isAutoExpanding={selectedRegionIndex !== null && autoExpandingRegionIndices.has(selectedRegionIndex)}
              onZoomInClick={() => setZoom("original")}
              onZoomOutClick={() => setZoom("fit")}
            />
            <WButton onClick={closeModal} sx={{ flex: 1 }}>
              Cancel
            </WButton>
          </>
        ) : undefined
      }
      rightPages={rightHidden ? undefined : rightPages}
      rightSelectedPage={desktopSelectedPage}
      onRightPageChange={(newPage) => {
        setDesktopSelectedPage(newPage);
        setControlGroupState(0);
        if (folderId && itemId) {
          navigate(`/collections/${folderId}/${itemId}/${newPage === 1 ? "recognitions" : "details"}`, {
            replace: true
          });
        }
      }}
      mobileSelectedPage={mobileSelectedPage}
      onMobileSelectedPageChange={(newPage) => {
        setMobileSelectedPage(newPage);
        if (folderId && itemId) {
          navigate(`/collections/${folderId}/${itemId}/${newPage === 2 ? "recognitions" : "details"}`, {
            replace: true
          });
        }
      }}
      rightTop={
        !rightHidden && desktopSelectedPage === 1 ? (
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
              onSaveButtonClick(editedName, editedPreviewAlignment, editedAttributes, selectedLayout, regions);
              closeModal();
            }}
            noLabel="Cancel"
            onNoClick={closeModal}
          />
        )
      }
      rightChildren={
        rightHidden ? undefined : desktopSelectedPage === 0 ? (
          <Details
            editedName={editedName}
            onEditedNameChange={setEditedName}
            src={src}
            editedPreviewAlignment={editedPreviewAlignment}
            onEditedPreviewAlignmentChange={setEditedPreviewAlignment}
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
            selectedRegionIndex={selectedRegionIndex}
            onRegionAvatarClick={onRegionAvatarClick}
            onRegionTypeChange={onRegionTypeChange}
            onRegionLanguageChange={onRegionLanguageChange}
            onRegionTextChange={onRegionTextChange}
            onRegionTextBlur={onRegionTextBlur}
            onRegionTranslateLanguageChange={onRegionTranslateLanguageChange}
            onRegionDelimiterChange={onRegionDelimiterChange}
            onRegionCorrectAnswerIndicesChange={onRegionCorrectAnswerIndicesChange}
            translatingRegionIndices={translatingRegionIndices}
          />
        )
      }
    >
      <Box sx={{ position: "relative", height: "100%" }}>
        <ImageRegionOverlay
          src={src}
          alt={name}
          regions={mobile || desktopSelectedPage === 1 ? regions : []}
          onRegionsChange={setRegions}
          onRegionMouseUp={onRegionMouseUp}
          scrollRef={imageScrollRef}
          fitScreen={zoom === "fit"}
          fullScreen={mobile || isFullScreen}
          selectedIndex={selectedRegionIndex}
          onSelectedIndexChange={onRegionSelect}
          isPolygonEnabled={isPolygonEnabled}
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
            onAddButtonClick={onAddRegionClick}
            onAutoExpandButtonClick={
              isPolygonEnabled && selectedRegionIndex !== null
                ? () => onAutoExpandRegionClick(selectedRegionIndex)
                : undefined
            }
            isAutoExpanding={selectedRegionIndex !== null && autoExpandingRegionIndices.has(selectedRegionIndex)}
            onDeleteButtonClick={onDeleteSelectedRegionClick}
            onZoomInClick={() => setZoom("original")}
            onZoomOutClick={() => setZoom("fit")}
            isFullScreen={isFullScreen}
            onFullScreenClick={onFullScreenClick}
            isRightHidden={isRightHidden}
            onDetailsClick={onDetailsClick}
            pages={rightPages}
            selectedPage={desktopSelectedPage}
            onPreviousClick={desktopSelectedPage === 1 ? undefined : onPreviousClick}
            onNextClick={desktopSelectedPage === 1 ? undefined : onNextClick}
            scrollbarWidths={scrollbarWidths}
          />
        )}
      </Box>
    </WModal>
  );
};
