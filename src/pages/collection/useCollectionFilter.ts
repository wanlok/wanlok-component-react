import { useEffect, useState } from "react";
import { CloudinaryFileInfo, Folder, YouTubeOEmbed } from "../../services/Types";

const uncategorisedValue = "__uncategorised__";

export const useCollectionFilter = (
  folder: Folder | undefined,
  files: [string, CloudinaryFileInfo][],
  youTubeRegularVideos: [string, YouTubeOEmbed][],
  youTubeShortVideos: [string, YouTubeOEmbed][]
) => {
  const [selectedAttributeKey, setSelectedAttributeKey] = useState("");
  const [selectedAttributeValue, setSelectedAttributeValue] = useState("");

  useEffect(() => {
    setSelectedAttributeKey("");
    setSelectedAttributeValue("");
  }, [folder?.name]);

  useEffect(() => {
    setSelectedAttributeValue("");
  }, [selectedAttributeKey]);

  const hasUncategorised =
    Boolean(selectedAttributeKey) &&
    [...files, ...youTubeRegularVideos, ...youTubeShortVideos].some(
      ([, item]) => !item.attributes?.[selectedAttributeKey]
    );

  useEffect(() => {
    if (!hasUncategorised && selectedAttributeValue === uncategorisedValue) {
      setSelectedAttributeValue("");
    }
  }, [hasUncategorised, selectedAttributeValue]);

  const attributeKeys = [
    { label: "All", value: "" },
    ...(folder?.attributes ?? []).map(({ name }) => ({ label: name, value: name }))
  ];

  const attributeValues = [
    { label: "All", value: "" },
    ...(hasUncategorised ? [{ label: "All (Uncategorised)", value: uncategorisedValue }] : []),
    ...[
      ...new Set(
        [
          ...files.map(([, item]) => item.attributes?.[selectedAttributeKey]),
          ...youTubeRegularVideos.map(([, item]) => item.attributes?.[selectedAttributeKey]),
          ...youTubeShortVideos.map(([, item]) => item.attributes?.[selectedAttributeKey])
        ].filter((v): v is string => Boolean(v))
      )
    ]
      .sort()
      .map((value) => ({ label: value, value }))
  ];

  const matchesFilter = (attributes: { [key: string]: string } | undefined) =>
    selectedAttributeValue === uncategorisedValue
      ? !attributes?.[selectedAttributeKey]
      : attributes?.[selectedAttributeKey] === selectedAttributeValue;

  const filteredFiles = selectedAttributeValue ? files.filter(([, item]) => matchesFilter(item.attributes)) : files;

  const filteredYouTubeRegularVideos = selectedAttributeValue
    ? youTubeRegularVideos.filter(([, item]) => matchesFilter(item.attributes))
    : youTubeRegularVideos;

  const filteredYouTubeShortVideos = selectedAttributeValue
    ? youTubeShortVideos.filter(([, item]) => matchesFilter(item.attributes))
    : youTubeShortVideos;

  return {
    attributeKeys,
    attributeValues,
    selectedAttributeKey,
    selectedAttributeValue,
    onAttributeKeyChange: setSelectedAttributeKey,
    onAttributeValueChange: setSelectedAttributeValue,
    filteredFiles,
    filteredYouTubeRegularVideos,
    filteredYouTubeShortVideos
  };
};
