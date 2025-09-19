import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface ComponentFolder {
  id: string;
  name: string;
}

export const folders: ComponentFolder[] = [
  { name: "Project 1", id: "project-1" },
  { name: "Project 2", id: "project-2" },
  { name: "Project 3", id: "project-3" }
];

export const useKanban = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState<ComponentFolder>();

  const openFolder = useCallback(
    (folder: ComponentFolder) => {
      navigate(`/kanban/${folder.id}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (folders.length > 0) {
      let folder: ComponentFolder | undefined = undefined;
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
