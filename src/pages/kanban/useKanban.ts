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

export interface ColumnData {
  name: string;
  list: string[];
}

const dummyData = [
  { name: "To Do", list: ["AAAAA"] },
  { name: "In Progress", list: ["BBBBB", "CCCCC"] },
  { name: "Ready To Deploy", list: ["DDDDD", "EEEEE"] },
  { name: "Done", list: ["FFFFF"] }
];

export const useKanban = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState<ComponentFolder>();

  const [columns, setColumns] = useState(dummyData);

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

  const addItem = () => {
    const newColumns = [...columns];
    newColumns[0].list.push("New Item");
    setColumns(newColumns);
  };

  return { selectedFolder, openFolder, columns, setColumns, addItem };
};
