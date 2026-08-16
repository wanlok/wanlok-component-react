import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface PlaygroundFolder {
  id: string;
  name: string;
}

export const folders: PlaygroundFolder[] = [
  { name: "Puzzle", id: "puzzle" },
  { name: "Quiz", id: "quiz" },
  { name: "Regions", id: "regions" }
];

export const usePlayground = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const openFolder = useCallback(
    (folder: PlaygroundFolder) => {
      navigate(`/playground/${folder.id}`);
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
