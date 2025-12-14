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

  const docRef = doc(db, collectionName, documentId);

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
      setKanban((await getDoc(docRef)).data() as Kanban | undefined);
    };
    fetchKanban();
  }, [docRef]);

  useEffect(() => {
    const project = kanban?.projects.find((project) => project.id === id);
    if (project) {
      setSelectedProject(project);
    }
  }, [id, kanban]);

  const addProject = async (name: string, columnNames: string[]) => {
    const document = await getDoc(docRef);
    const columns = columnNames.map((name) => ({ name, items: [] }));
    const project = { id: uuidv4(), name, columns };
    let kanban;
    if (document.exists()) {
      const projects = document.data().projects ?? [];
      kanban = { projects: [...projects, project] };
      await updateDoc(docRef, kanban);
    } else {
      kanban = { projects: [project] };
      await setDoc(docRef, kanban);
    }
    setKanban(kanban);
  };

  const deleteProject = async (project: KanbanProject) => {
    if (!kanban) {
      return;
    }
    const projects = kanban.projects.filter((p) => p.id !== project.id);
    updateDoc(docRef, { projects });
    setKanban({ projects });
    setSelectedProject(undefined);
  };

  const addItem = () => {
    if (!kanban || !selectedProject) {
      return;
    }
    const columns = [...selectedProject.columns];
    const itemNumber = selectedProject.columns.reduce((sum, { items }) => sum + items.length, 1);
    columns[0].items.push({ id: uuidv4(), name: `Item ${itemNumber}` });
    updateDoc(docRef, { projects: [...kanban.projects] });
    setSelectedProject({ ...selectedProject, columns });
  };

  const moveItem = (columns: KanbanColumn[]) => {
    if (!kanban || !selectedProject) {
      return;
    }
    updateDoc(docRef, { projects: [...kanban.projects] });
    setSelectedProject({ ...selectedProject, columns });
  };

  return { kanban, selectedProject, addProject, deleteProject, openProject, addItem, moveItem };
};
