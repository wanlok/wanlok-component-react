import { useRef } from "react";
import { Avatar, Divider, Skeleton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { CropFree as CropFreeIcon } from "@mui/icons-material";
import { ChartItem, CloudinaryFileInfo, CollectionAttributes, SteamInfo, viewUrls, YouTubeInfo } from "../../services/Types";
import { WChart } from "../../components/WChart";
import { WChip } from "../../components/WChip";
import { ImageTitle } from "../../components/ImageTitle";
import { getVisibleAttributeText } from "../../utils/getVisibleAttributeText";

export const CollectionList = ({
  charts,
  files,
  hyperlinks,
  steam,
  youTubeRegularVideos,
  youTubeShortVideos,
  loadingCount,
  controlGroupState,
  folderAttributes,
  onFileClick,
  onVideoClick,
  onDeleteButtonClick,
  onLeftButtonClick,
  onRightButtonClick
}: {
  charts: [string, ChartItem][];
  files: [string, CloudinaryFileInfo][];
  hyperlinks: [string, string][];
  steam: [string, SteamInfo][];
  youTubeRegularVideos: [string, YouTubeInfo][];
  youTubeShortVideos: [string, YouTubeInfo][];
  loadingCount: number;
  controlGroupState: number;
  folderAttributes: CollectionAttributes;
  onFileClick: (id: string, src: string, name: string) => void;
  onVideoClick: (
    type: "youtubeRegular" | "youtubeShorts",
    id: string,
    name: string,
    attributes: { [key: string]: string }
  ) => void;
  onDeleteButtonClick: (type: string, id: string) => void;
  onLeftButtonClick: (type: string, id: string) => void;
  onRightButtonClick: (type: string, id: string) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));

  const gridTemplateColumns = { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" };
  return (
    <Stack ref={containerRef} sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ display: "grid", gridTemplateColumns, gap: "1px" }}>
        {charts.map(([uuid, chartItem], i) => (
          <WChart
            key={`chart-${i}`}
            chartItem={chartItem}
            leftMost={i === 0}
            rightMost={i === charts.length - 1}
            scrollHorizontally={!mobile}
            onDeleteButtonClick={() => onDeleteButtonClick("charts", uuid)}
            onLeftButtonClick={() => onLeftButtonClick("charts", uuid)}
            onRightButtonClick={() => onRightButtonClick("charts", uuid)}
          />
        ))}
        {files.map(([id, { name, url, previewAlignment, textRegions, attributes }], i) => {
          const visibleAttributeText = getVisibleAttributeText(folderAttributes, attributes);
          return (
            <ImageTitle
              key={`files-${i}`}
              imageUrl={url}
              imageSx={{ objectPosition: previewAlignment ?? "top" }}
              name={name}
              onClick={() => onFileClick(id, url, name)}
              aspectRatio="16/9"
              bottomChildren={
                visibleAttributeText ? (
                  <Typography variant="body2" sx={{ color: "common.white" }}>
                    {visibleAttributeText}
                  </Typography>
                ) : undefined
              }
              rightChildren={
                <Stack sx={{ justifyContent: "center" }}>
                  {textRegions?.length && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: 12,
                        backgroundColor: "background.default",
                        color: "common.black"
                      }}
                    >
                      {textRegions?.length}
                    </Avatar>
                  )}
                </Stack>
              }
              leftMost={i === 0}
              rightMost={i === files.length - 1}
              scrollHorizontally={!mobile}
              controlGroupState={controlGroupState}
              onLeftButtonClick={() => onLeftButtonClick("files", id)}
              onRightButtonClick={() => onRightButtonClick("files", id)}
              onDeleteButtonClick={() => onDeleteButtonClick("files", id)}
            />
          );
        })}
        {hyperlinks.map(([url, id], i) => (
          <ImageTitle
            key={`hyperlinks-${i}`}
            imageUrl={`https://wanlok2025.github.io/screenshots/${id}.png`}
            name={url}
            href={url}
            aspectRatio="16/9"
            leftMost={i === 0}
            rightMost={i === hyperlinks.length - 1}
            scrollHorizontally={!mobile}
            controlGroupState={controlGroupState}
            onDeleteButtonClick={() => onDeleteButtonClick("hyperlinks", url)}
            onLeftButtonClick={() => onLeftButtonClick("hyperlinks", url)}
            onRightButtonClick={() => onRightButtonClick("hyperlinks", url)}
          />
        ))}
        {steam.map(([appId, { name, imageUrl }], i) => (
          <ImageTitle
            key={`steam-${i}`}
            imageUrl={imageUrl}
            name={name}
            href={`${viewUrls.steam}${appId}`}
            aspectRatio="92/43"
            leftMost={i === 0}
            rightMost={i === steam.length - 1}
            scrollHorizontally={!mobile}
            controlGroupState={controlGroupState}
            onDeleteButtonClick={() => onDeleteButtonClick("steam", appId)}
            onLeftButtonClick={() => onLeftButtonClick("steam", appId)}
            onRightButtonClick={() => onRightButtonClick("steam", appId)}
          />
        ))}
        {youTubeShortVideos.map(([id, { name, imageUrl, attributes }], i) => {
          const visibleAttributeText = getVisibleAttributeText(folderAttributes, attributes);
          return (
            <ImageTitle
              key={`youtube-shorts-${i}`}
              imageUrl={imageUrl}
              imageSx={{ objectFit: "contain" }}
              name={name}
              onClick={() => onVideoClick("youtubeShorts", id, name, attributes ?? {})}
              aspectRatio="16/9"
              bottomChildren={
                visibleAttributeText ? (
                  <Typography variant="body2" sx={{ color: "common.white" }}>
                    {visibleAttributeText}
                  </Typography>
                ) : undefined
              }
              leftMost={i === 0}
              rightMost={i === youTubeShortVideos.length - 1}
              scrollHorizontally={!mobile}
              controlGroupState={controlGroupState}
              onDeleteButtonClick={() => onDeleteButtonClick("youtubeShorts", id)}
              onLeftButtonClick={() => onLeftButtonClick("youtubeShorts", id)}
              onRightButtonClick={() => onRightButtonClick("youtubeShorts", id)}
            />
          );
        })}
        {youTubeRegularVideos.map(([id, { name, imageUrl, attributes }], i) => {
          const visibleAttributeText = getVisibleAttributeText(folderAttributes, attributes);
          return (
            <ImageTitle
              key={`youtube-regular-${i}`}
              imageUrl={imageUrl}
              name={name}
              onClick={() => onVideoClick("youtubeRegular", id, name, attributes ?? {})}
              aspectRatio="16/9"
              bottomChildren={
                visibleAttributeText ? (
                  <Typography variant="body2" sx={{ color: "common.white" }}>
                    {visibleAttributeText}
                  </Typography>
                ) : undefined
              }
              leftMost={i === 0}
              rightMost={i === youTubeRegularVideos.length - 1}
              scrollHorizontally={!mobile}
              controlGroupState={controlGroupState}
              onDeleteButtonClick={() => onDeleteButtonClick("youtubeRegular", id)}
              onLeftButtonClick={() => onLeftButtonClick("youtubeRegular", id)}
              onRightButtonClick={() => onRightButtonClick("youtubeRegular", id)}
            />
          );
        })}
        {Array.from({ length: loadingCount }).map((_, i) => (
          <Stack key={`pending-${i}`} sx={{ bgcolor: "background.default" }}>
            <Stack sx={{ aspectRatio: "16/9", position: "relative" }}>
              <Skeleton
                variant="rectangular"
                sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />
            </Stack>
            <Stack sx={{ p: 2, gap: 1, height: 48 }}>
              <Skeleton variant="rectangular" />
              <Skeleton variant="rectangular" sx={{ width: "40%" }} />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
