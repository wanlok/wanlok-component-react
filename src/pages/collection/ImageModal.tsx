import { useEffect, useRef, useState } from "react";
import { Avatar, Box, ButtonBase, Divider, Skeleton, Stack, Typography } from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  CropFree as CropFreeIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  Search as SearchIcon,
  Translate as TranslateIcon,
  ViewList as ViewListIcon
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import { WModal, WModalContent } from "../../components/WModal";
import { iconButtonSx, WButton } from "../../components/WButton";
import { YesNoButtons } from "../../components/YesNoButtons";
import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";
import { StyledContainer } from "../../components/StyledContainer";
import {
  getImageBase64String,
  getIsoLanguage,
  LANGUAGE_ITEMS,
  recognizeText,
  TRANSLATE_LANGUAGE_ITEMS,
  translateText
} from "../../common/ImageUtils";
import GoogleIcon from "../../assets/images/icons/google.png";
import BingIcon from "../../assets/images/icons/bing.png";
import { ImageRegionOverlay, TextRegion } from "./ImageRegionOverlay";

const ZOOM_ITEMS = [
  { label: "Fit Screen", value: "fit" },
  { label: "Original Size", value: "original" }
];

const RegionRow = ({
  region,
  index,
  controlGroupState,
  isSelected,
  onAvatarClick,
  onDeleteClick,
  onLanguageChange,
  onTextChange,
  onTextBlur,
  onTranslateLanguageChange,
  isTranslating
}: {
  region: TextRegion;
  index: number;
  controlGroupState: number;
  isSelected: boolean;
  onAvatarClick: () => void;
  onDeleteClick: () => void;
  onLanguageChange: (language: string) => void;
  onTextChange: (text: string) => void;
  onTextBlur: () => void;
  onTranslateLanguageChange: (language: string) => void;
  isTranslating: boolean;
}) => (
  <Stack sx={{}}>
    <ButtonBase
      sx={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 1, py: 1, pl: 1, ml: -1 }}
      onClick={onAvatarClick}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          fontSize: 12,
          backgroundColor: isSelected ? "common.black" : "background.default",
          color: isSelected ? "common.white" : "common.black"
        }}
      >
        {index + 1}
      </Avatar>
      <Typography variant="body2">
        x: {Math.round(region.x)} y: {Math.round(region.y)} w: {Math.round(region.width)} h: {Math.round(region.height)}
      </Typography>
    </ButtonBase>
    <StyledContainer sx={{ flexDirection: "row" }}>
      <Stack sx={{ flex: 1, p: 1, gap: 2 }}>
        <Stack sx={{ gap: 1 }}>
          <SelectInput
            label="Recognise Language"
            items={LANGUAGE_ITEMS}
            value={region.recogniseLanguage ?? "eng"}
            onChange={onLanguageChange}
          />
          <TextInput
            label="Text"
            value={region.recognisedText ?? ""}
            onChange={onTextChange}
            onBlur={onTextBlur}
            inputPropsSx={{ flex: 1 }}
          />
        </Stack>
        {controlGroupState === 3 && (
          <>
            <Divider />
            <Stack sx={{ gap: 1 }}>
              <SelectInput
                label="Translate Language"
                items={TRANSLATE_LANGUAGE_ITEMS}
                value={region.translateLanguage ?? ""}
                onChange={onTranslateLanguageChange}
              />
              {isTranslating ? (
                <Skeleton variant="rectangular" height={24} />
              ) : (
                <Typography variant="body1" sx={{ lineHeight: "24px" }}>
                  {region.translatedText ?? ""}
                </Typography>
              )}
            </Stack>
          </>
        )}
      </Stack>
      {controlGroupState === 1 && region.recognisedText && (
        <Stack sx={{ gap: "1px" }}>
          <WButton
            onClick={() =>
              window.open(`https://www.google.com/search?q=${encodeURIComponent(region.recognisedText!)}`, "_blank")
            }
            sx={iconButtonSx}
          >
            <Box component="img" src={GoogleIcon} sx={{ width: 16, height: 16 }} />
          </WButton>
          <WButton
            onClick={() =>
              window.open(`https://www.bing.com/search?q=${encodeURIComponent(region.recognisedText!)}`, "_blank")
            }
            sx={iconButtonSx}
          >
            <Box component="img" src={BingIcon} sx={{ width: 20, height: 20 }} />
          </WButton>
        </Stack>
      )}
      {controlGroupState === 2 && (
        <WButton onClick={onDeleteClick} sx={iconButtonSx}>
          <CloseIcon sx={{ fontSize: 24 }} />
        </WButton>
      )}
    </StyledContainer>
  </Stack>
);

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
        <TextInput label="Name" value={editedName} onChange={onEditedNameChange} inputPropsSx={{ flex: 1 }} />
      </StyledContainer>
      {folderAttributes.map(({ name: attributeName }, i) => (
        <StyledContainer key={`attribute-${i}`} sx={{ p: 1 }}>
          <TextInput
            label={attributeName}
            value={editedAttributes[attributeName] ?? ""}
            onChange={(value) => onEditedAttributesChange({ ...editedAttributes, [attributeName]: value })}
            inputPropsSx={{ flex: 1 }}
          />
        </StyledContainer>
      ))}
    </Stack>
  </Stack>
);

const Recognitions = ({
  regions,
  onRegionsChange,
  controlGroupState,
  selectedRegionId,
  onRegionAvatarClick,
  onRegionLanguageChange,
  onRegionTextChange,
  onRegionTextBlur,
  onRegionTranslateLanguageChange,
  translatingRegionIds
}: {
  regions: TextRegion[];
  onRegionsChange: (regions: TextRegion[]) => void;
  controlGroupState: number;
  selectedRegionId: string | null;
  onRegionAvatarClick: (regionId: string) => void;
  onRegionLanguageChange: (regionId: string, language: string) => void;
  onRegionTextChange: (regionId: string, text: string) => void;
  onRegionTextBlur: (regionId: string) => void;
  onRegionTranslateLanguageChange: (regionId: string, language: string) => void;
  translatingRegionIds: Set<string>;
}) => (
  <Stack sx={{ p: 2, gap: 1 }}>
    {regions.map((region, i) => (
      <RegionRow
        key={region.id}
        region={region}
        index={i}
        controlGroupState={controlGroupState}
        isSelected={region.id === selectedRegionId}
        isTranslating={translatingRegionIds.has(region.id)}
        onAvatarClick={() => onRegionAvatarClick(region.id)}
        onDeleteClick={() => onRegionsChange(regions.filter((r) => r.id !== region.id))}
        onLanguageChange={(language) => onRegionLanguageChange(region.id, language)}
        onTextChange={(text) => onRegionTextChange(region.id, text)}
        onTextBlur={() => onRegionTextBlur(region.id)}
        onTranslateLanguageChange={(language) => onRegionTranslateLanguageChange(region.id, language)}
      />
    ))}
  </Stack>
);

export const ImageModal = ({
  open,
  src,
  name,
  attributes,
  textRegions,
  folderAttributes,
  onSaveButtonClick,
  onEditFolderButtonClick,
  onClose
}: {
  open: boolean;
  src: string;
  name: string;
  attributes: { [key: string]: string };
  textRegions: TextRegion[];
  folderAttributes: { name: string }[];
  onSaveButtonClick: (name: string, attributes: { [key: string]: string }, textRegions: TextRegion[]) => void;
  onEditFolderButtonClick: () => void;
  onClose: () => void;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const [editedName, setEditedName] = useState(name);
  const [editedAttributes, setEditedAttributes] = useState<{ [key: string]: string }>(attributes);
  const [regions, setRegions] = useState<TextRegion[]>(textRegions);
  const [controlGroupState, setControlGroupState] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [translatingRegionIds, setTranslatingRegionIds] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState("fit");
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);

  const onAddRegionClick = () => {
    setRegions((prev) => [...prev, { id: String(Date.now()), x: 80, y: 40, width: 240, height: 135 }]);
    imageScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      setEditedName(name);
      setEditedAttributes(attributes);
      setRegions(textRegions);
      setControlGroupState(0);
      setSelectedTab(0);
      setSelectedRegionId(null);
      setTranslatingRegionIds(new Set());
      setZoom("fit");
      imageCanvasRef.current = null;
    }
  }, [open, name, attributes]);

  const recognizeRegionText = async (region: TextRegion, language: string) => {
    if (!imageCanvasRef.current) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = src;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      imageCanvasRef.current = canvas;
    }
    const base64 = getImageBase64String(imageCanvasRef.current, {
      x: Math.round(region.x),
      y: Math.round(region.y),
      width: Math.round(region.width),
      height: Math.round(region.height)
    });
    if (!base64) {
      return;
    }
    const text = await recognizeText(base64, language);
    setRegions((prev) => prev.map((r) => (r.id === region.id ? { ...r, recognisedText: text } : r)));
    if (controlGroupState === 3 && text && region.translateLanguage) {
      await performTranslation(region.id, text, getIsoLanguage(language), region.translateLanguage);
    }
  };

  const onRegionMouseUp = async (regionId: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (!region) {
      return;
    }
    await recognizeRegionText(region, region.recogniseLanguage ?? "eng");
  };

  const onRegionLanguageChange = async (regionId: string, language: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (!region) {
      return;
    }
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, recogniseLanguage: language } : r)));
    await recognizeRegionText(region, language);
  };

  const onRegionTextChange = (regionId: string, text: string) => {
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, recognisedText: text } : r)));
  };

  const onRegionTextBlur = async (regionId: string) => {
    if (controlGroupState !== 3) {
      return;
    }
    const region = regions.find((r) => r.id === regionId);
    if (!region || !region.recognisedText || !region.translateLanguage) {
      return;
    }
    await performTranslation(regionId, region.recognisedText, getIsoLanguage(region.recogniseLanguage ?? "eng"), region.translateLanguage);
  };

  const performTranslation = async (regionId: string, text: string, sourceLanguage: string, targetLanguage: string) => {
    setTranslatingRegionIds((prev) => new Set(prev).add(regionId));
    if (sourceLanguage === targetLanguage) {
      setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, translatedText: text } : r)));
    } else {
      const translatedText = await translateText(text, sourceLanguage, targetLanguage);
      setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, translatedText } : r)));
    }
    setTranslatingRegionIds((prev) => {
      const next = new Set(prev);
      next.delete(regionId);
      return next;
    });
  };

  const onTranslateToggle = async () => {
    const nextState = controlGroupState === 3 ? 0 : 3;
    setControlGroupState(nextState);
    if (nextState !== 3) {
      return;
    }
    regions.forEach(async (region) => {
      if (!region.recognisedText || region.translatedText) {
        return;
      }
      const targetLanguage = region.translateLanguage ?? "";
      if (!targetLanguage) {
        return;
      }
      await performTranslation(
        region.id,
        region.recognisedText,
        getIsoLanguage(region.recogniseLanguage ?? "eng"),
        targetLanguage
      );
    });
  };

  const onRegionTranslateLanguageChange = async (regionId: string, translateLanguage: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (!region || !region.recognisedText) {
      setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, translateLanguage } : r)));
      return;
    }
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, translateLanguage } : r)));
    await performTranslation(
      regionId,
      region.recognisedText,
      getIsoLanguage(region.recogniseLanguage ?? "eng"),
      translateLanguage
    );
  };

  const onRegionAvatarClick = (regionId: string) => {
    setSelectedRegionId(regionId);
    const region = regions.find((r) => r.id === regionId);
    if (!region) {
      return;
    }
    const container = imageScrollRef.current;
    if (!container) {
      return;
    }
    container.scrollTo({
      left: region.x - container.clientWidth / 2 + region.width / 2,
      top: region.y - container.clientHeight / 2 + region.height / 2,
      behavior: "smooth"
    });
  };

  return (
    <WModal
      open={open}
      onClose={onClose}
      width="80vw"
      height="80dvh"
      tabs={[{ icon: <ImageIcon sx={{ fontSize: 24 }} />, label: "Image" }]}
      hideLeftLabel
      rightTabs={[
        { icon: <ViewListIcon sx={{ fontSize: 24 }} />, label: "Details" },
        { icon: <CropFreeIcon sx={{ fontSize: 24 }} />, label: "Recognitions" }
      ]}
      rightTab={selectedTab}
      onRightTabChange={(tab) => {
        setSelectedTab(tab);
        setControlGroupState(0);
      }}
      right={
        <WModalContent
          top={
            selectedTab === 1 ? (
              <>
                <WButton onClick={onAddRegionClick} sx={iconButtonSx}>
                  <AddIcon sx={{ fontSize: 24 }} />
                </WButton>
                <WButton isActivated={controlGroupState === 3} onClick={onTranslateToggle} sx={iconButtonSx}>
                  <TranslateIcon sx={{ fontSize: 20 }} />
                </WButton>
                <WButton
                  isActivated={controlGroupState === 1}
                  onClick={() => setControlGroupState(controlGroupState === 1 ? 0 : 1)}
                  sx={iconButtonSx}
                >
                  <SearchIcon sx={{ fontSize: 24 }} />
                </WButton>
                <WButton
                  isActivated={controlGroupState === 2}
                  onClick={() => setControlGroupState(controlGroupState === 2 ? 0 : 2)}
                  sx={iconButtonSx}
                >
                  <CloseIcon sx={{ fontSize: 24 }} />
                </WButton>
              </>
            ) : (
              <>
                <StyledContainer sx={{ flex: 1, p: 1 }}>
                  <SelectInput items={ZOOM_ITEMS} value={zoom} onChange={setZoom} />
                </StyledContainer>
                <WButton
                  onClick={() => {
                    onClose();
                    onEditFolderButtonClick();
                  }}
                  rightIcon={<EditIcon sx={{ fontSize: 18, mt: -0.1 }} />}
                  sx={{ height: 56 }}
                >
                  Edit Folder
                </WButton>
              </>
            )
          }
          bottom={
            <YesNoButtons
              yesLabel="Save"
              onYesClick={() => {
                onSaveButtonClick(editedName, editedAttributes, regions);
                onClose();
              }}
              noLabel="Cancel"
              onNoClick={onClose}
            />
          }
        >
          {selectedTab === 0 ? (
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
              controlGroupState={controlGroupState}
              selectedRegionId={selectedRegionId}
              onRegionAvatarClick={onRegionAvatarClick}
              onRegionLanguageChange={onRegionLanguageChange}
              onRegionTextChange={onRegionTextChange}
              onRegionTextBlur={onRegionTextBlur}
              onRegionTranslateLanguageChange={onRegionTranslateLanguageChange}
              translatingRegionIds={translatingRegionIds}
            />
          )}
        </WModalContent>
      }
    >
      <ImageRegionOverlay
        src={src}
        alt={name}
        regions={mobile || selectedTab === 1 ? regions : []}
        onRegionsChange={setRegions}
        onRegionMouseUp={onRegionMouseUp}
        scrollRef={imageScrollRef}
        fitScreen={selectedTab === 0 && zoom === "fit"}
        selectedId={selectedRegionId}
        onSelectedIdChange={setSelectedRegionId}
      />
    </WModal>
  );
};
