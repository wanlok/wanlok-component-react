import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface PricesFolder {
  id: string;
  name: string;
}

export const folders: PricesFolder[] = [
  { name: "Games", id: "games" },
  { name: "Supermarkets", id: "supermarkets" }
];

export const usePrices = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const openFolder = useCallback(
    (folder: PricesFolder) => {
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
