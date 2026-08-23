import { useQuery } from "@tanstack/react-query";
import { ApiResponse, apiUrl, Collection } from "../../../services/ApiTypes";

const emptyRegionNames: string[] = [];

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

  return { regionNames };
};
