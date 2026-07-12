import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface PlaygroundFolder {
  id: string;
  name: string;
}

export const folders: PlaygroundFolder[] = [
  { name: "Puzzle", id: "puzzle" }
];

export const usePlayground = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState<PlaygroundFolder>();

  const openFolder = useCallback(
    (folder: PlaygroundFolder) => {
      navigate(`/components/${folder.id}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (folders.length > 0) {
      let folder: PlaygroundFolder | undefined = undefined;
      if (id) {
        folder = folders.find((f) => f.id === id);
      }
      if (folder) {
        setSelectedFolder(folder);
      } else {
        openFolder(folders[0]);
      }
    }
  }, [id, openFolder]);

  return { selectedFolder, openFolder };
};
