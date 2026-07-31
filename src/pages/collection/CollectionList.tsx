import { useRef } from "react";
import { Skeleton, Stack, useMediaQuery, useTheme } from "@mui/material";
import { ChartItem, CloudinaryFileInfo, SteamInfo, viewUrls, YouTubeInfo } from "../../services/Types";
import { WChart } from "../../components/WChart";
import { ImageTitleLink } from "../../components/ImageTitleLink";

export const CollectionList = ({
  isLoading,
  charts,
  files,
  hyperlinks,
  steam,
  youTubeRegularVideos,
  youTubeShortVideos,
  loadingCount,
  controlGroupState,
  onFileClick,
  onVideoClick,
  onDeleteButtonClick,
  onLeftButtonClick,
  onRightButtonClick
}: {
  isLoading: boolean;
  charts: [string, ChartItem][];
  files: [string, CloudinaryFileInfo][];
  hyperlinks: [string, string][];
  steam: [string, SteamInfo][];
  youTubeRegularVideos: [string, YouTubeInfo][];
  youTubeShortVideos: [string, YouTubeInfo][];
  loadingCount: number;
  controlGroupState: number;
  onFileClick: (id: string, src: string, name: string) => void;
  onVideoClick: (type: "youtube_regular" | "youtube_shorts", id: string, name: string, attributes: { [key: string]: string }) => void;
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
        {files.map(([id, { name, url }], i) => (
          <ImageTitleLink
            key={`files-${i}`}
            imageUrl={url}
            imageSx={{ objectPosition: "top" }}
            name={name}
            onClick={() => onFileClick(id, url, name)}
            aspectRatio="16/9"
            leftMost={i === 0}
            rightMost={i === files.length - 1}
            scrollHorizontally={!mobile}
            controlGroupState={controlGroupState}
            onLeftButtonClick={() => onLeftButtonClick("files", id)}
            onRightButtonClick={() => onRightButtonClick("files", id)}
            onDeleteButtonClick={() => onDeleteButtonClick("files", id)}
          />
        ))}
        {hyperlinks.map(([url, id], i) => (
          <ImageTitleLink
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
          <ImageTitleLink
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
        {youTubeShortVideos.map(([id, { name, imageUrl, attributes }], i) => (
          <ImageTitleLink
            key={`youtube-shorts-${i}`}
            imageUrl={imageUrl}
            imageSx={{ objectFit: "contain" }}
            name={name}
            onClick={() => onVideoClick("youtube_shorts", id, name, attributes ?? {})}
            aspectRatio="16/9"
            leftMost={i === 0}
            rightMost={i === youTubeShortVideos.length - 1}
            scrollHorizontally={!mobile}
            controlGroupState={controlGroupState}
            onDeleteButtonClick={() => onDeleteButtonClick("youtube_shorts", id)}
            onLeftButtonClick={() => onLeftButtonClick("youtube_shorts", id)}
            onRightButtonClick={() => onRightButtonClick("youtube_shorts", id)}
          />
        ))}
        {youTubeRegularVideos.map(([id, { name, imageUrl, attributes }], i) => (
          <ImageTitleLink
            key={`youtube-regular-${i}`}
            imageUrl={imageUrl}
            name={name}
            onClick={() => onVideoClick("youtube_regular", id, name, attributes ?? {})}
            aspectRatio="16/9"
            leftMost={i === 0}
            rightMost={i === youTubeRegularVideos.length - 1}
            scrollHorizontally={!mobile}
            controlGroupState={controlGroupState}
            onDeleteButtonClick={() => onDeleteButtonClick("youtube_regular", id)}
            onLeftButtonClick={() => onLeftButtonClick("youtube_regular", id)}
            onRightButtonClick={() => onRightButtonClick("youtube_regular", id)}
          />
        ))}
        {Array.from({ length: loadingCount }).map((_, i) => (
          <Stack key={`pending-${i}`} sx={{ bgcolor: "background.default" }}>
            <Stack sx={{ aspectRatio: "16/9", position: "relative" }}>
              <Skeleton
                variant="rectangular"
                sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />
            </Stack>
            <Stack sx={{ p: 2, gap: 1 }}>
              <Skeleton variant="rectangular" />
              <Skeleton variant="rectangular" sx={{ width: "40%" }} />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
