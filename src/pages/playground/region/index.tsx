import { useState } from "react";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { bottomSx, LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { SelectInput } from "../../../components/SelectInput";
import { StyledContainer } from "../../../components/StyledContainer";
import { EmptyPlaceholder } from "../../../components/EmptyPlaceholder";
import { ZoomPanImage } from "../../../components/ZoomPanImage";
import { CollectionItem, Region } from "../../../services/ApiTypes";
import { useRegion } from "./useRegion";

const RegionImage = ({ src, regions }: { src: string; regions: Region[] }) => {
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  return (
    <ZoomPanImage
      src={src}
      alt=""
      scale={1}
      sx={{ backgroundColor: "common.black" }}
      onNaturalSizeChange={setNaturalSize}
    >
      <Box
        component="svg"
        {...(naturalSize.width > 0 && { viewBox: `0 0 ${naturalSize.width} ${naturalSize.height}` })}
        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible" }}
      >
        {regions.map((region, i) => (
          <polygon
            key={i}
            points={region.points.map((point) => `${point.x},${point.y}`).join(" ")}
            fill="transparent"
            style={{ cursor: "pointer" }}
            onClick={() => region.text && alert(region.text)}
          />
        ))}
      </Box>
    </ZoomPanImage>
  );
};

const ControlBar = ({
  regionNames,
  selectedRegionName,
  setSelectedRegionName,
  regionItems,
  selectedRegionItemId,
  setSelectedRegionItemId
}: {
  regionNames: string[];
  selectedRegionName: string;
  setSelectedRegionName: (value: string) => void;
  regionItems: [string, CollectionItem][];
  selectedRegionItemId: string;
  setSelectedRegionItemId: (value: string) => void;
}) => {
  const items = regionNames.map((name) => ({ label: name, value: name }));
  const itemItems = regionItems.map(([id, item]) => ({ label: item.name, value: id }));
  return (
    <StyledContainer sx={{ flex: 1, flexDirection: "row", p: 1, gap: 1 }}>
      <Stack sx={{ flex: 1 }}>
        <SelectInput items={items} value={selectedRegionName} onChange={setSelectedRegionName} />
      </Stack>
      {regionItems.length > 0 && (
        <Stack sx={{ flex: 1 }}>
          <SelectInput items={itemItems} value={selectedRegionItemId} onChange={setSelectedRegionItemId} />
        </Stack>
      )}
    </StyledContainer>
  );
};

export const Index = () => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const {
    regionNames,
    selectedRegionName,
    setSelectedRegionName,
    regionItems,
    selectedRegionItemId,
    setSelectedRegionItemId,
    selectedRegionItem
  } = useRegion();

  return (
    <Stack sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
      <LayoutHeader
        top={
          <Stack sx={[topSx, { flex: 1, px: 2, alignItems: "center" }]}>
            <Typography variant="body1">Region</Typography>
          </Stack>
        }
        bottom={
          <Stack sx={[bottomSx]}>
            <ControlBar
              regionNames={regionNames}
              selectedRegionName={selectedRegionName}
              setSelectedRegionName={setSelectedRegionName}
              regionItems={regionItems}
              selectedRegionItemId={selectedRegionItemId}
              setSelectedRegionItemId={setSelectedRegionItemId}
            />
          </Stack>
        }
      />
      {mobile && (
        <Stack sx={{ flexDirection: "row" }}>
          <ControlBar
            regionNames={regionNames}
            selectedRegionName={selectedRegionName}
            setSelectedRegionName={setSelectedRegionName}
            regionItems={regionItems}
            selectedRegionItemId={selectedRegionItemId}
            setSelectedRegionItemId={setSelectedRegionItemId}
          />
        </Stack>
      )}
      {selectedRegionItem ? (
        <RegionImage src={selectedRegionItem.url} regions={selectedRegionItem.regions ?? []} />
      ) : (
        <EmptyPlaceholder text="No region selected" />
      )}
    </Stack>
  );
};
