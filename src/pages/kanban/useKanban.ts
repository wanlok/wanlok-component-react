import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase";

const collectionName = "configs";
const documentId = "kanban";

export interface ComponentFolder {
  id: string;
  name: string;
}

export const folders: ComponentFolder[] = [
  { name: "Project 1", id: "project-1" },
  { name: "Project 2", id: "project-2" },
  { name: "Project 3", id: "project-3" }
];

export interface ColumnItem {
  id: string;
  name: string;
}

export interface ColumnData {
  name: string;
  list: ColumnItem[];
}

const dummyData: ColumnData[] = [
  { name: "To Do", list: [] },
  { name: "In Progress", list: [] },
  { name: "Ready To Deploy", list: [] },
  { name: "Done", list: [] }
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

  const addProject = async (name: string) => {
    if (name.length === 0) {
      return;
    }
    const docRef = doc(db, collectionName, documentId);
    const document = await getDoc(docRef);
    if (document.exists()) {
      const projects = document.data().projects || [];
      await updateDoc(docRef, { projects: [...projects, { name }] });
    } else {
      await setDoc(docRef, { projects: [{ name }] });
    }
  };

  const addItem = () => {
    const newColumns = [...columns];
    const itemNumber = columns.reduce((sum, { list }) => sum + list.length, 1);
    newColumns[0].list.push({ id: uuidv4(), name: `Item ${itemNumber}` });
    setColumns(newColumns);
  };

  return { selectedFolder, openFolder, columns, setColumns, addProject, addItem };
};
