import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { FileInfo, serverUrl, TextItem, viewUrls } from "../../services/Types";
import { seperate } from "../../common/LayoutUtils";
import { WChart } from "../../components/WChart";
import { ImageTitleLink } from "../../components/ImageTitleLink";
import { getFileExtension } from "../../common/FileUtils";
import { WCarousel } from "../../components/WCarousel";
import { TextCard } from "../../components/TextCard";

export const CollectionList = ({
  charts,
  files,
  hyperlinks,
  steam,
  texts,
  youTubeRegularVideos,
  youTubeShortVideos,
  controlGroupState,
  onLeftButtonClick,
  onRightButtonClick,
  onDeleteButtonClick
}: {
  charts: [string, any][];
  files: [string, FileInfo][];
  hyperlinks: [string, string][];
  steam: [string, any][];
  texts: [string, TextItem][];
  youTubeRegularVideos: [string, any][];
  youTubeShortVideos: [string, any][];
  controlGroupState: number;
  onLeftButtonClick: (type: string, id: string) => void;
  onRightButtonClick: (type: string, id: string) => void;
  onDeleteButtonClick: (type: string, id: string) => void;
}) => {
  const { breakpoints } = useTheme();
  const tablet = useMediaQuery(breakpoints.down("xl"));
  const mobile = useMediaQuery(breakpoints.down("sm"));
  const numberOfComponentsPerSlide = 4;
  const list = [charts, files, hyperlinks, steam, youTubeShortVideos, youTubeRegularVideos];
  const width = mobile ? "100%" : tablet ? "calc(50% - 1px)" : "calc(25% - 1px)";
  return (
    <Stack sx={{ flex: 1, overflowY: "auto" }}>
      <Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, charts) }}>
          {charts.map(([uuid, chartItem], i) => (
            <WChart
              key={`chart-${i}`}
              chartItem={chartItem}
              width={mobile ? "100%" : "calc(50% - 1px)"}
              leftMost={i === 0}
              rightMost={i === charts.length - 1}
              scrollHorizontally={false}
              onLeftButtonClick={() => onLeftButtonClick("charts", uuid)}
              onRightButtonClick={() => onRightButtonClick("charts", uuid)}
              onDeleteButtonClick={() => onDeleteButtonClick("charts", uuid)}
            />
          ))}
        </Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, files) }}>
          {files.map(([id, { name, mime_type }], i) => {
            const imageUrl = `${viewUrls.files}${id}${getFileExtension(mime_type)}`;
            return (
              <ImageTitleLink
                key={`files-${i}`}
                imageUrl={imageUrl}
                imageSx={{ objectPosition: "top" }}
                title={name}
                href={imageUrl}
                width={width}
                aspectRatio={"16/9"}
                leftMost={i === 0}
                rightMost={i === files.length - 1}
                scrollHorizontally={false}
                controlGroupState={controlGroupState}
                onLeftButtonClick={() => onLeftButtonClick("files", id)}
                onRightButtonClick={() => onRightButtonClick("files", id)}
                onDeleteButtonClick={() => onDeleteButtonClick("files", id)}
              />
            );
          })}
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
              aspectRatio={"16/9"}
              leftMost={i === 0}
              rightMost={i === hyperlinks.length - 1}
              scrollHorizontally={false}
              controlGroupState={controlGroupState}
              onLeftButtonClick={() => onLeftButtonClick("hyperlinks", url)}
              onRightButtonClick={() => onRightButtonClick("hyperlinks", url)}
              onDeleteButtonClick={() => onDeleteButtonClick("hyperlinks", url)}
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
              onLeftButtonClick={() => onLeftButtonClick("steam", appId)}
              onRightButtonClick={() => onRightButtonClick("steam", appId)}
              onDeleteButtonClick={() => onDeleteButtonClick("steam", appId)}
            />
          ))}
        </Stack>
        <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: "1px", mt: seperate(list, texts) }}>
          {texts.map(([id, { value }], i) => (
            <TextCard
              key={id}
              text={value}
              width={width}
              leftMost={i === 0}
              rightMost={i === texts.length - 1}
              scrollHorizontally={false}
              controlGroupState={controlGroupState}
              onLeftButtonClick={() => onLeftButtonClick("texts", id)}
              onRightButtonClick={() => onRightButtonClick("texts", id)}
              onDeleteButtonClick={() => onDeleteButtonClick("texts", id)}
            />
          ))}
        </Stack>
        <WCarousel
          list={youTubeShortVideos}
          numberOfComponentsPerSlide={mobile ? 2 : numberOfComponentsPerSlide}
          slideKey={(i) => `youtube-shorts-${i}`}
          renderContent={([id, { title, thumbnail_url }], i, j) => (
            <ImageTitleLink
              key={`youtube-shorts-${i}-${j}`}
              imageUrl={thumbnail_url}
              title={title}
              href={`${viewUrls.youtube_shorts}${id}`}
              width={mobile ? "50%" : `calc(${100 / numberOfComponentsPerSlide}% - 1px)`}
              aspectRatio="9/16"
              leftMost={i === 0 && j === 0}
              rightMost={i * numberOfComponentsPerSlide + j === youTubeShortVideos.length - 1}
              scrollHorizontally={true}
              controlGroupState={controlGroupState}
              onLeftButtonClick={() => onLeftButtonClick("youtube_shorts", id)}
              onRightButtonClick={() => onRightButtonClick("youtube_shorts", id)}
              onDeleteButtonClick={() => onDeleteButtonClick("youtube_shorts", id)}
            />
          )}
          sx={{ mt: seperate(list, youTubeShortVideos) }}
        />
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
              onLeftButtonClick={() => onLeftButtonClick("youtube_regular", id)}
              onRightButtonClick={() => onRightButtonClick("youtube_regular", id)}
              onDeleteButtonClick={() => onDeleteButtonClick("youtube_regular", id)}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
