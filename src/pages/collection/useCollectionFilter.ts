import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { CloudinaryFileInfo, Folder, YouTubeInfo } from "../../services/Types";
import { toSlug } from "../../common/StringUtils";

const uncategorisedValue = "__uncategorised__";

export const useCollectionFilter = (
  folder: Folder | undefined,
  files: [string, CloudinaryFileInfo][],
  youTubeRegularVideos: [string, YouTubeInfo][],
  youTubeShortVideos: [string, YouTubeInfo][]
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedAttributeKey = searchParams.get("key") ?? "";
  const selectedAttributeValue = searchParams.get("value") ?? "";

  const originalAttributeKey =
    folder?.attributes.find((attribute) => toSlug(attribute.name) === selectedAttributeKey)?.name ??
    selectedAttributeKey;

  const prevFolderNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (prevFolderNameRef.current !== undefined) {
      setSearchParams(
        (prev) => {
          prev.delete("key");
          prev.delete("value");
          return prev;
        },
        { replace: true }
      );
    }
    prevFolderNameRef.current = folder?.name;
  }, [folder?.name]);

  useEffect(() => {
    if (selectedAttributeKey && !attributeKeys.some((k) => k.value === selectedAttributeKey)) {
      setSearchParams(
        (prev) => {
          prev.delete("key");
          prev.delete("value");
          return prev;
        },
        { replace: true }
      );
    }
  }, [selectedAttributeKey, folder?.attributes]);

  const hasUncategorised =
    Boolean(selectedAttributeKey) &&
    [...files, ...youTubeRegularVideos, ...youTubeShortVideos].some(
      ([, item]) => !item.attributes?.[originalAttributeKey]
    );

  useEffect(() => {
    if (!hasUncategorised && selectedAttributeValue === uncategorisedValue) {
      setSearchParams(
        (prev) => {
          prev.delete("value");
          return prev;
        },
        { replace: true }
      );
    }
  }, [hasUncategorised, selectedAttributeValue]);

  const attributeKeys = [
    { label: "All", value: "" },
    ...(folder?.attributes ?? []).map(({ name }) => ({ label: name, value: toSlug(name) }))
  ];

  const attributeValues = [
    { label: "All", value: "" },
    ...(hasUncategorised ? [{ label: "All (Uncategorised)", value: uncategorisedValue }] : []),
    ...[
      ...new Set(
        [
          ...files.map(([, item]) => item.attributes?.[originalAttributeKey]),
          ...youTubeRegularVideos.map(([, item]) => item.attributes?.[originalAttributeKey]),
          ...youTubeShortVideos.map(([, item]) => item.attributes?.[originalAttributeKey])
        ].filter((v): v is string => Boolean(v))
      )
    ]
      .sort()
      .map((value) => ({ label: value, value: toSlug(value) }))
  ];

  const matchesFilter = (attributes: { [key: string]: string } | undefined) =>
    selectedAttributeValue === uncategorisedValue
      ? !attributes?.[originalAttributeKey]
      : toSlug(attributes?.[originalAttributeKey] ?? "") === selectedAttributeValue;

  const filteredFiles = selectedAttributeValue ? files.filter(([, item]) => matchesFilter(item.attributes)) : files;

  const filteredYouTubeRegularVideos = selectedAttributeValue
    ? youTubeRegularVideos.filter(([, item]) => matchesFilter(item.attributes))
    : youTubeRegularVideos;

  const filteredYouTubeShortVideos = selectedAttributeValue
    ? youTubeShortVideos.filter(([, item]) => matchesFilter(item.attributes))
    : youTubeShortVideos;

  const onAttributeKeyChange = (value: string) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set("key", value);
        } else {
          prev.delete("key");
        }
        prev.delete("value");
        return prev;
      },
      { replace: true }
    );
  };

  const onAttributeValueChange = (value: string) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set("value", value);
        } else {
          prev.delete("value");
        }
        return prev;
      },
      { replace: true }
    );
  };

  return {
    attributeKeys,
    attributeValues,
    selectedAttributeKey,
    selectedAttributeValue,
    onAttributeKeyChange,
    onAttributeValueChange,
    filteredFiles,
    filteredYouTubeRegularVideos,
    filteredYouTubeShortVideos
  };
};
