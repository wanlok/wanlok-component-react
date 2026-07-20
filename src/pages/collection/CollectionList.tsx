import { Stack } from "@mui/material";
import { ChartItem, CloudinaryFileInfo, serverUrl, SteamInfo, viewUrls, YouTubeOEmbed } from "../../services/Types";
import { seperate } from "../../common/LayoutUtils";
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
  youTubeRegularVideos: [string, YouTubeOEmbed][];
  youTubeShortVideos: [string, YouTubeOEmbed][];
  controlGroupState: number;
  onDetailsButtonClick: (type: string, id: string) => void;
  onDeleteButtonClick: (type: string, id: string) => void;
  onLeftButtonClick: (type: string, id: string) => void;
  onRightButtonClick: (type: string, id: string) => void;
}) => {
  const list = [charts, files, hyperlinks, steam, youTubeShortVideos, youTubeRegularVideos];
  const width = { xs: "100%", sm: "calc(50% - 1px)", lg: "calc(33.333% - 1px)", xl: "calc(25% - 1px)" };
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, charts) }}>
          {charts.map(([uuid, chartItem], i) => (
            <WChart
              key={`chart-${i}`}
              chartItem={chartItem}
              width={{ xs: "100%", sm: "calc(50% - 1px)" }}
              leftMost={i === 0}
              rightMost={i === charts.length - 1}
              scrollHorizontally={false}
              onDeleteButtonClick={() => onDeleteButtonClick("charts", uuid)}
              onLeftButtonClick={() => onLeftButtonClick("charts", uuid)}
              onRightButtonClick={() => onRightButtonClick("charts", uuid)}
            />
          ))}
        </Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, files) }}>
          {files.map(([id, { name, url }], i) => (
            <ImageTitleLink
              key={`files-${i}`}
              imageUrl={url}
              imageSx={{ objectPosition: "top" }}
              title={name}
              href={url}
              width={width}
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
        </Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, hyperlinks) }}>
          {hyperlinks.map(([url, id], i) => (
            <ImageTitleLink
              key={`hyperlinks-${i}`}
              imageUrl={`https://wanlok2025.github.io/screenshots/${id}.png`}
              imageFallbackUrl={`${serverUrl}/screenshot/${id}.png`}
              title={url}
              href={url}
              width={width}
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
        </Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, steam) }}>
          {steam.map(([appId, { title, imageUrl }], i) => (
            <ImageTitleLink
              key={`steam-${i}`}
              imageUrl={imageUrl}
              title={title}
              href={`${viewUrls.steam}${appId}`}
              width={width}
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
        </Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, youTubeShortVideos) }}>
          {youTubeShortVideos.map(([id, { title, thumbnail_url }], i) => (
            <ImageTitleLink
              key={`youtube-shorts-${i}`}
              imageUrl={thumbnail_url}
              imageSx={{ objectFit: "contain" }}
              title={title}
              href={`${viewUrls.youtube_shorts}${id}`}
              width={width}
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
        </Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, youTubeRegularVideos) }}>
          {youTubeRegularVideos.map(([id, { title, thumbnail_url }], i) => (
            <ImageTitleLink
              key={`youtube-regular-${i}`}
              imageUrl={thumbnail_url}
              title={title}
              href={`${viewUrls.youtube_regular}${id}`}
              width={width}
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
    </Stack>
  );
};
