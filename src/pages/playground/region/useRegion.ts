import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, apiUrl, Collection, CollectionItem } from "../../../services/ApiTypes";
import { toSlug } from "../../../common/StringUtils";

export const useRegion = () => {
  // List collection names that have regions
  const { data: regionNames = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () =>
      fetch(`${apiUrl}/collections`)
        .then((response) => response.json() as Promise<ApiResponse<Collection[]>>)
        .then((response) =>
          response.data.filter((collection) => collection.counts.region > 0).map((collection) => collection.name)
        )
  });

  // Select first region -- asserted every render (not just on a detected list change) so it
  // still fires when regionNames is already warm from react-query's cache on mount.
  const [selectedRegionName, setSelectedRegionName] = useState("");
  if (!selectedRegionName && regionNames.length > 0) {
    setSelectedRegionName(regionNames[0]);
  }

  // List item names with regions in the selected collection
  const { data: items = {} } = useQuery({
    queryKey: ["collection", selectedRegionName],
    queryFn: ({ signal }) =>
      fetch(`${apiUrl}/collections/${toSlug(selectedRegionName)}`, { signal })
        .then((response) => response.json() as Promise<ApiResponse<Record<string, CollectionItem>>>)
        .then((response) => response.data),
    enabled: !!selectedRegionName
  });
  const regionItemNames = Object.values(items)
    .filter((item) => (item.regions?.length ?? 0) > 0)
    .map((item) => item.name);

  // Select first item -- same value-based assertion as above, plus resetting to the new list's
  // first item once the previously selected name stops being valid (e.g. after switching regions).
  const [selectedRegionItemName, setSelectedRegionItemName] = useState("");
  if (selectedRegionItemName && !regionItemNames.includes(selectedRegionItemName)) {
    setSelectedRegionItemName(regionItemNames[0] ?? "");
  } else if (!selectedRegionItemName && regionItemNames.length > 0) {
    setSelectedRegionItemName(regionItemNames[0]);
  }

  const selectedRegionItem = Object.values(items).find((item) => item.name === selectedRegionItemName);

  return {
    regionNames,
    selectedRegionName,
    setSelectedRegionName,
    regionItemNames,
    selectedRegionItemName,
    setSelectedRegionItemName,
    selectedRegionItem
  };
};
