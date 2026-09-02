import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { CloudinaryFileInfo, Folder, YouTubeInfo } from "../../services/Types";
import { toSlug } from "../../utils/StringUtils";

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

  const attributeKeys = useMemo(
    () => [
      { label: "All", value: "" },
      ...(folder?.attributes ?? []).map(({ name }) => ({ label: name, value: toSlug(name) }))
    ],
    [folder?.attributes]
  );

  const hasUncategorised =
    Boolean(selectedAttributeKey) &&
    [...files, ...youTubeRegularVideos, ...youTubeShortVideos].some(
      ([, item]) => !item.attributes?.[originalAttributeKey]
    );

  const attributeValues = useMemo(
    () => [
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
    ],
    [hasUncategorised, files, youTubeRegularVideos, youTubeShortVideos, originalAttributeKey]
  );

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
    // setSearchParams's identity is not stable across renders in this react-router-dom version: it changes
    // every time the URL changes, including from this effect's own setSearchParams call. Including it here
    // would re-run this effect (and re-delete key/value) on every unrelated search-param change, not just
    // when the folder actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see setSearchParams note above
  }, [selectedAttributeKey, attributeKeys]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see setSearchParams note above
  }, [hasUncategorised, selectedAttributeValue]);

  useEffect(() => {
    if (selectedAttributeKey && !selectedAttributeValue && attributeValues.length > 0) {
      setSearchParams(
        (prev) => {
          prev.set("value", attributeValues[0].value);
          return prev;
        },
        { replace: true }
      );
    }
    // attributeValues is a new array reference on every render (files/videos come from an unmemoized toList()),
    // so depending on it directly would re-run this effect, and force the value back to attributeValues[0], on
    // every unrelated render. setSearchParams is omitted for the same reason as the effects above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttributeKey, selectedAttributeValue, attributeValues.length]);

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
