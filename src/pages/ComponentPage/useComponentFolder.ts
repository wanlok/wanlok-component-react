import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface ComponentFolder {
  id: string;
  name: string;
}

export const folders: ComponentFolder[] = [
  { name: "Basic Inputs", id: "basic-inputs" },
  { name: "ArcGIS Hong Kong Map", id: "arcgis-hong-kong-map" },
  { name: "Snapshot", id: "snapshot" }
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
