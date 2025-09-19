import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface ComponentFolder {
  id: string;
  name: string;
}

export const folders: ComponentFolder[] = [
  { name: "Folder 1", id: "folder-1" },
  { name: "Folder 2", id: "folder-2" },
  { name: "Folder 3", id: "folder-3" }
];

export const useComponentFolder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState<ComponentFolder>();

  const openFolder = useCallback(
    (folder: ComponentFolder) => {
      navigate(`/components/${folder.id}`);
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
