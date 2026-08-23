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

  // No default selection -- the user picks a region explicitly, and the placeholder shows until then.
  const [selectedRegionName, setSelectedRegionName] = useState("");

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

  // No default selection either, but reset it if it stops being valid (e.g. after switching regions).
  const [selectedRegionItemName, setSelectedRegionItemName] = useState("");
  if (selectedRegionItemName && !regionItemNames.includes(selectedRegionItemName)) {
    setSelectedRegionItemName("");
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
