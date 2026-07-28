import { useEffect, useRef, useState } from "react";
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon, Image as ImageIcon, ViewList as ViewListIcon } from "@mui/icons-material";
import { WModal, WModalContent } from "../../components/WModal";
import { iconButtonSx, WButton } from "../../components/WButton";
import { YesNoButtons } from "../../components/YesNoButtons";
import { TextInput } from "../../components/TextInput";
import { StyledContainer } from "../../components/StyledContainer";
import { getImageBase64String, recognizeText } from "../../common/ImageUtils";
import GoogleIcon from "../../assets/images/icons/Google.svg";
import { ImageRegionOverlay, Region } from "./ImageRegionOverlay";

const RegionThumbnail = ({ src, region }: { src: string; region: Region }) => {
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: `${region.width} / ${region.height}`,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "common.black"
      }}
    >
      <Box
        component="img"
        src={src}
        sx={{
          position: "absolute",
          width: naturalSize.width > 0 ? `${(naturalSize.width / region.width) * 100}%` : 0,
          height: naturalSize.height > 0 ? `${(naturalSize.height / region.height) * 100}%` : 0,
          left: `${(-region.x / region.width) * 100}%`,
          top: `${(-region.y / region.height) * 100}%`
        }}
        onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
          setNaturalSize({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight });
        }}
      />
    </Box>
  );
};

const RegionRow = ({
  src,
  region,
  index,
  isDeletingRegion,
  onDeleteClick
}: {
  src: string;
  region: Region;
  index: number;
  isDeletingRegion: boolean;
  onDeleteClick: () => void;
}) => (
  <StyledContainer sx={{ flexDirection: "row" }}>
    <Stack sx={{ flex: 1, p: 1, gap: 1 }}>
      <Stack sx={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: 12, backgroundColor: "common.black", color: "common.white" }}>
          {index + 1}
        </Avatar>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ flex: 1 }}
        >{`x: ${Math.round(region.x)},  y: ${Math.round(region.y)},  w: ${Math.round(region.width)},  h: ${Math.round(region.height)}`}</Typography>
      </Stack>
      <RegionThumbnail src={src} region={region} />
      <Typography variant="body1" color={region.text ? "text.primary" : "text.secondary"}>
        {region.text ?? "No text recognised"}
      </Typography>
    </Stack>
    {isDeletingRegion && (
      <WButton onClick={onDeleteClick} sx={iconButtonSx}>
        <CloseIcon sx={{ fontSize: 24 }} />
      </WButton>
    )}
    {!isDeletingRegion && region.text && (
      <Stack sx={{ gap: "1px" }}>
        <WButton
          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(region.text!)}`, "_blank")}
          sx={iconButtonSx}
        >
          <Box component="img" src={GoogleIcon} sx={{ width: 20, height: 20 }} />
        </WButton>
      </Stack>
    )}
  </StyledContainer>
);

const Details = ({
  src,
  editedName,
  onEditedNameChange,
  editedAttributes,
  onEditedAttributesChange,
  folderAttributes,
  regions,
  onRegionsChange,
  onAddRegionClick,
  isDeletingRegion,
  onIsDeletingRegionChange
}: {
  src: string;
  editedName: string;
  onEditedNameChange: (name: string) => void;
  editedAttributes: { [key: string]: string };
  onEditedAttributesChange: (attributes: { [key: string]: string }) => void;
  folderAttributes: { name: string }[];
  regions: Region[];
  onRegionsChange: (regions: Region[]) => void;
  onAddRegionClick: () => void;
  isDeletingRegion: boolean;
  onIsDeletingRegionChange: (isDeleting: boolean) => void;
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
    <Divider />
    <Stack sx={{ gap: 1 }}>
      <Stack sx={{ flexDirection: "row", gap: "1px" }}>
        <Typography variant="body1" sx={{ flex: 1, alignSelf: "center" }}>
          {`Regions (${regions.length})`}
        </Typography>
        <WButton onClick={onAddRegionClick} sx={iconButtonSx}>
          <AddIcon sx={{ fontSize: 24 }} />
        </WButton>
        <WButton
          isActivated={isDeletingRegion}
          onClick={() => onIsDeletingRegionChange(!isDeletingRegion)}
          sx={iconButtonSx}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </WButton>
      </Stack>
      <Stack sx={{ gap: "1px" }}>
        {regions.map((region, i) => (
          <RegionRow
            key={region.id}
            src={src}
            region={region}
            index={i}
            isDeletingRegion={isDeletingRegion}
            onDeleteClick={() => onRegionsChange(regions.filter((r) => r.id !== region.id))}
          />
        ))}
      </Stack>
    </Stack>
  </Stack>
);

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
  const [editedName, setEditedName] = useState(name);
  const [editedAttributes, setEditedAttributes] = useState<{ [key: string]: string }>(attributes);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isDeletingRegion, setIsDeletingRegion] = useState(false);
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);

  const onAddRegionClick = () => {
    setRegions((prev) => [...prev, { id: String(Date.now()), x: 50, y: 50, width: 240, height: 135 }]);
    imageScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      setEditedName(name);
      setEditedAttributes(attributes);
      setRegions([]);
      setIsDeletingRegion(false);
      imageCanvasRef.current = null;
    }
  }, [open, name, attributes]);

  const onRegionMouseUp = async (regionId: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (!region) {
      return;
    }
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
    const text = await recognizeText(base64);
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, text } : r)));
  };

  return (
    <WModal
      open={open}
      onClose={onClose}
      width="80vw"
      height="80dvh"
      tabs={[{ icon: <ImageIcon sx={{ fontSize: 24 }} />, label: "Image" }]}
      hideLeftLabel
      rightTabs={[{ icon: <ViewListIcon sx={{ fontSize: 24 }} />, label: "Details" }]}
      right={
        <WModalContent
          bottom={
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
        >
          <Details
            src={src}
            editedName={editedName}
            onEditedNameChange={setEditedName}
            editedAttributes={editedAttributes}
            onEditedAttributesChange={setEditedAttributes}
            folderAttributes={folderAttributes}
            regions={regions}
            onRegionsChange={setRegions}
            onAddRegionClick={onAddRegionClick}
            isDeletingRegion={isDeletingRegion}
            onIsDeletingRegionChange={setIsDeletingRegion}
          />
        </WModalContent>
      }
    >
      <ImageRegionOverlay
        src={src}
        alt={name}
        regions={regions}
        onRegionsChange={setRegions}
        onRegionMouseUp={onRegionMouseUp}
        scrollRef={imageScrollRef}
      />
    </WModal>
  );
};
