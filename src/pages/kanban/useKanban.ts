import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase";
import { Kanban, KanbanProject } from "../../services/Types";

const collectionName = "configs";
const documentId = "kanban";

// const dummyData: ColumnData[] = [
//   { name: "To Do", list: [] },
//   { name: "In Progress", list: [] },
//   { name: "Ready To Deploy", list: [] },
//   { name: "Done", list: [] }
// ];

export const useKanban = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // const [columns, setColumns] = useState(dummyData);

  const [kanban, setKanban] = useState<Kanban>();
  const [selectedProject, setSelectedProject] = useState<KanbanProject>();

  const fetched = useRef<boolean>(false);

  const openProject = useCallback(
    (project: KanbanProject) => {
      navigate(`/kanban/${project.id}`);
    },
    [navigate]
  );

  useEffect(() => {
    const fetchKanban = async () => {
      if (fetched.current) {
        return;
      }
      fetched.current = true;
      const docRef = doc(db, collectionName, documentId);
      setKanban((await getDoc(docRef)).data() as Kanban | undefined);
    };
    fetchKanban();
  }, [documentId]);

  useEffect(() => {
    const project = kanban?.projects.find((project) => project.id === id);
    if (project) {
      setSelectedProject(project);
    }
  }, [id, kanban]);

  const addProject = async (name: string, columns: string[]) => {
    const docRef = doc(db, collectionName, documentId);
    const document = await getDoc(docRef);
    const id = uuidv4();
    const project = { id, name, columns };
    if (document.exists()) {
      const projects = document.data().projects ?? [];
      await updateDoc(docRef, { projects: [...projects, project] });
    } else {
      await setDoc(docRef, { projects: [project] });
    }
  };

  const addItem = () => {
    // const newColumns = [...columns];
    // const itemNumber = columns.reduce((sum, { list }) => sum + list.length, 1);
    // newColumns[0].list.push({ id: uuidv4(), name: `Item ${itemNumber}` });
    // setColumns(newColumns);
  };

  return { selectedProject, addProject, openProject, kanban: kanban, addItem };
};
