import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, apiUrl, Collection, CollectionItem } from "../../../services/ApiTypes";
import { toSlug } from "../../../common/StringUtils";

const emptyRegionNames: string[] = [];
const emptyItems: Record<string, CollectionItem> = {};

export const useRegion = () => {
  // List collection names that have regions
  const { data: regionNames = emptyRegionNames } = useQuery({
    queryKey: ["collections"],
    queryFn: () =>
      fetch(`${apiUrl}/collections`)
        .then((response) => response.json() as Promise<ApiResponse<Collection[]>>)
        .then((response) =>
          response.data.filter((collection) => collection.counts.region > 0).map((collection) => collection.name)
        )
  });

  // Select first region
  const [selectedRegionName, setSelectedRegionName] = useState("");

  const [prevRegionNames, setPrevRegionNames] = useState(regionNames);
  if (regionNames !== prevRegionNames) {
    setPrevRegionNames(regionNames);
    if (!selectedRegionName && regionNames.length > 0) {
      setSelectedRegionName(regionNames[0]);
    }
  }

  // List item names with regions in the selected collection
  const { data: items = emptyItems } = useQuery({
    queryKey: ["collection", selectedRegionName],
    queryFn: ({ signal }) =>
      fetch(`${apiUrl}/collections/${toSlug(selectedRegionName)}`, { signal })
        .then((response) => response.json() as Promise<ApiResponse<Record<string, CollectionItem>>>)
        .then((response) => response.data),
    enabled: !!selectedRegionName
  });

  // items stays a stable reference from react-query while unchanged, so memoizing on it keeps
  // regionItemNames stable too -- required for the reference-equality check below to terminate.
  const regionItemNames = useMemo(
    () =>
      Object.values(items)
        .filter((item) => (item.regions?.length ?? 0) > 0)
        .map((item) => item.name),
    [items]
  );

  // Select first item
  const [selectedRegionItemName, setSelectedRegionItemName] = useState("");

  const [prevRegionItemNames, setPrevRegionItemNames] = useState(regionItemNames);
  if (regionItemNames !== prevRegionItemNames) {
    setPrevRegionItemNames(regionItemNames);
    setSelectedRegionItemName(
      regionItemNames.includes(selectedRegionItemName) ? selectedRegionItemName : (regionItemNames[0] ?? "")
    );
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
