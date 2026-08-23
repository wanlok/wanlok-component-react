import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, apiUrl, Collection, CollectionItem } from "../../../services/ApiTypes";
import { toSlug } from "../../../common/StringUtils";

const emptyItems: Record<string, CollectionItem> = {};

export const useRegion = () => {
  // List collection names that have regions
  const { data: regionNames = [] } = useQuery({
    queryKey: ["collections", "region"],
    queryFn: () =>
      fetch(`${apiUrl}/collections`)
        .then((response) => response.json() as Promise<ApiResponse<Collection[]>>)
        .then((response) =>
          response.data.filter((collection) => collection.counts.region > 0).map((collection) => collection.name)
        )
  });

  // No default selection -- the user picks a region explicitly, and the placeholder shows until then.
  const [selectedRegionName, setSelectedRegionName] = useState("");

  // List items with regions in the selected collection -- items can share the same display name
  // (e.g. PDF pages), so selection is keyed by id.
  const { data: items = emptyItems } = useQuery({
    queryKey: ["collection", selectedRegionName],
    queryFn: ({ signal }) =>
      fetch(`${apiUrl}/collections/${toSlug(selectedRegionName)}`, { signal })
        .then((response) => response.json() as Promise<ApiResponse<Record<string, CollectionItem>>>)
        .then((response) => response.data),
    enabled: !!selectedRegionName
  });
  const regionItems = Object.entries(items).filter(([, item]) => (item.regions?.length ?? 0) > 0);

  // No default selection either, but reset it if it stops being valid (e.g. after switching regions).
  const [selectedRegionItemId, setSelectedRegionItemId] = useState("");
  if (selectedRegionItemId && !regionItems.some(([id]) => id === selectedRegionItemId)) {
    setSelectedRegionItemId("");
  }

  const selectedRegionItem = items[selectedRegionItemId];

  return {
    regionNames,
    selectedRegionName,
    setSelectedRegionName,
    regionItems,
    selectedRegionItemId,
    setSelectedRegionItemId,
    selectedRegionItem
  };
};
