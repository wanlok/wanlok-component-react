import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface PlaygroundFolder {
  id: string;
  name: string;
}

export const folders: PlaygroundFolder[] = [
  { name: "Game Price Analysis", id: "game-price-analysis" },
  { name: "Image", id: "image" },
  { name: "Puzzle", id: "puzzle" },
  { name: "Quiz", id: "quiz" },
  { name: "Region", id: "region" }
];

export const usePlayground = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const openFolder = useCallback(
    (folder: PlaygroundFolder) => {
      navigate(`/${folder.id}`);
    },
    [navigate]
  );

  const selectedFolder = id ? folders.find((f) => f.id === id) : undefined;

  useEffect(() => {
    if (folders.length > 0 && !selectedFolder) {
      openFolder(folders[0]);
    }
  }, [selectedFolder, openFolder]);

  return { selectedFolder, openFolder };
};
