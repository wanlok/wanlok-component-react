import { Stack } from "@mui/material";
import { ChartItem, CloudinaryFileInfo, serverUrl, SteamInfo, viewUrls, YouTubeInfo } from "../../services/Types";
import { WChart } from "../../components/WChart";
import { ImageTitleLink } from "../../components/ImageTitleLink";

export const CollectionList = ({
  charts,
  files,
  hyperlinks,
  steam,
  youTubeRegularVideos,
  youTubeShortVideos,
  controlGroupState,
  onDetailsButtonClick,
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
  controlGroupState: number;
  onDetailsButtonClick: (type: string, id: string) => void;
  onDeleteButtonClick: (type: string, id: string) => void;
  onLeftButtonClick: (type: string, id: string) => void;
  onRightButtonClick: (type: string, id: string) => void;
}) => {
  const gridTemplateColumns = { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" };
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack sx={{ display: "grid", gridTemplateColumns, gap: "1px" }}>
        {charts.map(([uuid, chartItem], i) => (
          <WChart
            key={`chart-${i}`}
            chartItem={chartItem}
            leftMost={i === 0}
            rightMost={i === charts.length - 1}
            scrollHorizontally={false}
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
            href={url}
            aspectRatio="16/9"
            leftMost={i === 0}
            rightMost={i === files.length - 1}
            scrollHorizontally={false}
            controlGroupState={controlGroupState}
            onDetailsButtonClick={() => onDetailsButtonClick("files", id)}
            onLeftButtonClick={() => onLeftButtonClick("files", id)}
            onRightButtonClick={() => onRightButtonClick("files", id)}
            onDeleteButtonClick={() => onDeleteButtonClick("files", id)}
          />
        ))}
        {hyperlinks.map(([url, id], i) => (
          <ImageTitleLink
            key={`hyperlinks-${i}`}
            imageUrl={`https://wanlok2025.github.io/screenshots/${id}.png`}
            imageFallbackUrl={`${serverUrl}/screenshot/${id}.png`}
            name={url}
            href={url}
            aspectRatio="16/9"
            leftMost={i === 0}
            rightMost={i === hyperlinks.length - 1}
            scrollHorizontally={false}
            controlGroupState={controlGroupState}
            onDetailsButtonClick={() => onDetailsButtonClick("hyperlinks", url)}
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
            scrollHorizontally={false}
            controlGroupState={controlGroupState}
            onDetailsButtonClick={() => onDetailsButtonClick("steam", appId)}
            onDeleteButtonClick={() => onDeleteButtonClick("steam", appId)}
            onLeftButtonClick={() => onLeftButtonClick("steam", appId)}
            onRightButtonClick={() => onRightButtonClick("steam", appId)}
          />
        ))}
        {youTubeShortVideos.map(([id, { name, imageUrl }], i) => (
          <ImageTitleLink
            key={`youtube-shorts-${i}`}
            imageUrl={imageUrl}
            imageSx={{ objectFit: "contain" }}
            name={name}
            href={`${viewUrls.youtube_shorts}${id}`}
            aspectRatio="16/9"
            leftMost={i === 0}
            rightMost={i === youTubeShortVideos.length - 1}
            scrollHorizontally={false}
            controlGroupState={controlGroupState}
            onDetailsButtonClick={() => onDetailsButtonClick("youtube_shorts", id)}
            onDeleteButtonClick={() => onDeleteButtonClick("youtube_shorts", id)}
            onLeftButtonClick={() => onLeftButtonClick("youtube_shorts", id)}
            onRightButtonClick={() => onRightButtonClick("youtube_shorts", id)}
          />
        ))}
        {youTubeRegularVideos.map(([id, { name, imageUrl }], i) => (
          <ImageTitleLink
            key={`youtube-regular-${i}`}
            imageUrl={imageUrl}
            name={name}
            href={`${viewUrls.youtube_regular}${id}`}
            aspectRatio="16/9"
            leftMost={i === 0}
            rightMost={i === youTubeRegularVideos.length - 1}
            scrollHorizontally={false}
            controlGroupState={controlGroupState}
            onDetailsButtonClick={() => onDetailsButtonClick("youtube_regular", id)}
            onDeleteButtonClick={() => onDeleteButtonClick("youtube_regular", id)}
            onLeftButtonClick={() => onLeftButtonClick("youtube_regular", id)}
            onRightButtonClick={() => onRightButtonClick("youtube_regular", id)}
          />
        ))}
      </Stack>
    </Stack>
  );
};
