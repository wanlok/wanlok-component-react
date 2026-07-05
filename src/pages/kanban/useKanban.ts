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
    const projects = kanban?.projects ?? [];
    if (projects.length > 0) {
      const project = projects.find((project) => project.id === id);
      if (project) {
        setSelectedProject(project);
      } else {
        openProject(projects[0]);
      }
    }
  }, [id, kanban, openProject]);

  const addProject = async (name: string, columnNames: string[]) => {
    const document = await getDoc(docRef);
    const columns = columnNames.map((name) => ({ name, items: [] }));
    const project = { id: uuidv4(), name, columns, created_at: new Date().toISOString() };
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

  const updateProject = async (name: string, columnNames: string[]) => {
    if (!kanban || !selectedProject) {
      return;
    }
    const updatedProject = {
      ...selectedProject,
      name,
      columns: columnNames.map((columnName, i) => ({
        ...(selectedProject.columns[i] ?? { items: [] }),
        name: columnName
      }))
    };
    const projects = kanban.projects.map((project) => (project.id === selectedProject.id ? updatedProject : project));
    await updateDoc(docRef, { projects });
    setKanban({ ...kanban, projects });
    setSelectedProject(updatedProject);
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
    const newItem = { id: uuidv4(), name: "", content: "", created_at: new Date().toISOString() };
    const columns = selectedProject.columns.map((column, i) =>
      i === 0 ? { ...column, items: [...column.items, newItem] } : column
    );
    const updatedProject = { ...selectedProject, columns };
    const projects = kanban.projects.map((project) => (project.id === selectedProject.id ? updatedProject : project));
    updateDoc(docRef, { projects });
    setKanban({ ...kanban, projects });
    setSelectedProject(updatedProject);
  };

  const deleteItem = (columnIndex: number, itemIndex: number) => {
    if (!kanban || !selectedProject) {
      return;
    }
    const columns = selectedProject.columns.map((column, i) =>
      i === columnIndex ? { ...column, items: column.items.filter((_, j) => j !== itemIndex) } : column
    );
    const updatedProject = { ...selectedProject, columns };
    const projects = kanban.projects.map((project) => (project.id === selectedProject.id ? updatedProject : project));
    updateDoc(docRef, { projects });
    setKanban({ ...kanban, projects });
    setSelectedProject(updatedProject);
  };

  const updateItem = (columnIndex: number, itemIndex: number, name: string, content: string) => {
    if (!kanban || !selectedProject) {
      return;
    }
    const columns = selectedProject.columns.map((column, i) =>
      i === columnIndex
        ? { ...column, items: column.items.map((item, j) => (j === itemIndex ? { ...item, name, content } : item)) }
        : column
    );
    const updatedProject = { ...selectedProject, columns };
    const projects = kanban.projects.map((project) => (project.id === selectedProject.id ? updatedProject : project));
    updateDoc(docRef, { projects });
    setKanban({ ...kanban, projects });
    setSelectedProject(updatedProject);
  };

  const moveItem = (columns: KanbanColumn[]) => {
    if (!kanban || !selectedProject) {
      return;
    }
    const updatedProject = { ...selectedProject, columns };
    const projects = kanban.projects.map((project) => (project.id === selectedProject.id ? updatedProject : project));
    updateDoc(docRef, { projects });
    setKanban({ ...kanban, projects });
    setSelectedProject(updatedProject);
  };

  return {
    isLoading: kanban === undefined,
    kanban,
    selectedProject,
    addProject,
    updateProject,
    deleteProject,
    openProject,
    addItem,
    updateItem,
    deleteItem,
    moveItem
  };
};
