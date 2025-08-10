import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Snapshot } from "../snapshot/useSnapshot";
import { useParams } from "react-router-dom";

export const usePDFSnapshot = () => {
  const { id } = useParams();
  const [snapshot, setSnapshot] = useState<Snapshot>();

  useEffect(() => {
    if (id) {
      fetchSnapshot(id);
    }
  }, [id]);

  const fetchSnapshot = async (id: string) => {
    const docRef = doc(db, "snapshots", id);
    setSnapshot((await getDoc(docRef)).data() as Snapshot);
  };

  return { snapshot };
};
