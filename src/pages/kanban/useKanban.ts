import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase";
import { Kanban, KanbanColumn, KanbanProject } from "../../services/Types";

const collectionName = "configs";
const documentId = "kanban";

export const useKanban = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  }, []);

  useEffect(() => {
    const project = kanban?.projects.find((project) => project.id === id);
    if (project) {
      setSelectedProject(project);
    }
  }, [id, kanban]);

  const addProject = async (name: string, columnNames: string[]) => {
    const docRef = doc(db, collectionName, documentId);
    const document = await getDoc(docRef);
    const columns = columnNames.map((name) => ({ name, items: [] }));
    const project = { id: uuidv4(), name, columns };
    if (document.exists()) {
      const projects = document.data().projects ?? [];
      await updateDoc(docRef, { projects: [...projects, project] });
    } else {
      await setDoc(docRef, { projects: [project] });
    }
  };

  const addItem = () => {
    if (!selectedProject) {
      return;
    }
    const columns = [...selectedProject.columns];
    const itemNumber = selectedProject.columns.reduce((sum, { items }) => sum + items.length, 1);
    columns[0].items.push({ id: uuidv4(), name: `Item ${itemNumber}` });
    setSelectedProject({ ...selectedProject, columns });
  };

  const moveItem = (columns: KanbanColumn[]) => {
    if (!kanban || !selectedProject) {
      return;
    }
    setSelectedProject({ ...selectedProject, columns });
    const docRef = doc(db, collectionName, documentId);
    updateDoc(docRef, { projects: [...kanban.projects] });
  };

  return { kanban, selectedProject, addProject, openProject, addItem, moveItem };
};
