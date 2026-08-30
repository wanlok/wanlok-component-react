import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, apiUrl, Games, Platform, SaveGameResponse } from "../../../services/ApiTypes";

const emptyGames: Games = { nintendo: {}, steam: {} };

export const useGamePrice = () => {
  const queryClient = useQueryClient();

  const { data: games = emptyGames } = useQuery({
    queryKey: ["games"],
    queryFn: () =>
      fetch(`${apiUrl}/games`)
        .then((response) => response.json() as Promise<ApiResponse<Games>>)
        .then((response) => response.data)
  });

  // postGame returns the whole updated Games document, so write it straight into the cache
  // instead of invalidating and refetching.
  const { mutateAsync: postGame } = useMutation({
    mutationFn: (variables: { name: string; url: string }) =>
      fetch(`${apiUrl}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables)
      }).then((response) => response.json() as Promise<SaveGameResponse>),
    onSuccess: (response) => {
      if (response.status === "ok") {
        queryClient.setQueryData(["games"], response.data);
      }
    }
  });

  const addGame = async (name: string, url: string) => {
    const response = await postGame({ name, url });
    return response.status === "error" ? { error: response.message } : {};
  };

  // patchGame also returns the whole updated Games document.
  const { mutate: patchGame } = useMutation({
    mutationFn: (variables: { platform: Platform; name: string; newName: string }) =>
      fetch(`${apiUrl}/games`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables)
      })
        .then((response) => response.json() as Promise<ApiResponse<Games>>)
        .then((response) => response.data),
    onSuccess: (data) => queryClient.setQueryData(["games"], data)
  });

  const renameGame = (platform: Platform, name: string, newName: string) => {
    patchGame({ platform, name, newName });
  };

  // deleteGame also returns the whole updated Games document.
  const { mutate: deleteGameMutation } = useMutation({
    mutationFn: (variables: { platform: Platform; name: string }) =>
      fetch(`${apiUrl}/games`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables)
      })
        .then((response) => response.json() as Promise<ApiResponse<Games>>)
        .then((response) => response.data),
    onSuccess: (data) => queryClient.setQueryData(["games"], data)
  });

  const deleteGame = (platform: Platform, name: string) => {
    deleteGameMutation({ platform, name });
  };

  return { games, addGame, renameGame, deleteGame };
};
