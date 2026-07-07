import { Stack, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ChartItem, CloudinaryFileInfo, Folder, SteamInfo, YouTubeOEmbed } from "../../services/Types";
import { WModal } from "../../components/WModal";
import { TextInput } from "../../components/TextInput";
import { WButton } from "../../components/WButton";

export const Dummy2 = ({
  charts,
  files,
  hyperlinks,
  steam,
  youTubeRegularVideos,
  youTubeShortVideos,
  collectionTypeId,
  setCollectionTypeId,
  selectedFolder,
  updateCollectionAttributes
}: {
  charts: [string, ChartItem][];
  files: [string, CloudinaryFileInfo][];
  hyperlinks: [string, string][];
  steam: [string, SteamInfo][];
  youTubeRegularVideos: [string, YouTubeOEmbed][];
  youTubeShortVideos: [string, YouTubeOEmbed][];
  collectionTypeId: { type: string; id: string } | undefined;
  setCollectionTypeId: Dispatch<SetStateAction<{ type: string; id: string } | undefined>>;
  selectedFolder?: Folder;
  updateCollectionAttributes: (
    type: string,
    id: string,
    attributes: {
      [key: string]: string;
    }
  ) => Promise<void>;
}) => {
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!collectionTypeId) {
      setAttributes({});
      return;
    }
    const { type, id } = collectionTypeId;
    const findItem = () => {
      if (type === "charts") {
        return charts.find(([itemId]) => itemId === id);
      }
      if (type === "files") {
        return files.find(([itemId]) => itemId === id);
      }
      if (type === "hyperlinks") {
        return hyperlinks.find(([itemId]) => itemId === id);
      }
      if (type === "steam") {
        return steam.find(([itemId]) => itemId === id);
      }
      if (type === "youtube_regular") {
        return youTubeRegularVideos.find(([itemId]) => itemId === id);
      }
      if (type === "youtube_shorts") {
        return youTubeShortVideos.find(([itemId]) => itemId === id);
      }
    };
    const item = findItem();
    if (item) {
      const value = item[1];
      if (typeof value !== "string" && "attributes" in value) {
        setAttributes(value.attributes ?? {});
      } else {
        setAttributes({});
      }
    } else {
      setAttributes({});
    }
  }, [charts, files, hyperlinks, steam, youTubeRegularVideos, youTubeShortVideos, collectionTypeId]);

  return (
    <WModal open={collectionTypeId !== undefined} onClose={() => setCollectionTypeId(undefined)}>
      <Stack sx={{ flexDirection: "row", height: 48 }}>
        <Stack sx={{ flex: 1, p: 1, justifyContent: "center" }}>
          <Typography variant="body1">Attributes</Typography>
        </Stack>
      </Stack>
      {selectedFolder?.attributes.map(({ name }, i) => {
        return (
          <Stack key={`attribute-${i}`} sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
            <Stack sx={{ flex: 1 }}>
              <Typography variant="body1">{name}</Typography>
            </Stack>
            <Stack sx={{ flex: 1 }}>
              <TextInput
                value={attributes[name]}
                onChange={(value) => {
                  const newAttributes = { ...attributes };
                  newAttributes[name] = value;
                  setAttributes(newAttributes);
                }}
                hideHelperText={true}
                inputPropsSx={{ flex: 1 }}
              />
            </Stack>
          </Stack>
        );
      })}
      <WButton
        onClick={async () => {
          if (collectionTypeId) {
            const { type, id } = collectionTypeId;
            await updateCollectionAttributes(type, id, attributes);
            setCollectionTypeId(undefined);
          }
        }}
      >
        Save
      </WButton>
    </WModal>
  );
};
