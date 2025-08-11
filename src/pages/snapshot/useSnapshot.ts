import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export interface Row {
  type: string;
  value: string;
}

export interface Snapshot {
  id?: string;
  timestamp: number;
  rows: Row[];
}

const isValid = (snapshot: Snapshot) => {
  return !snapshot.rows.some((row) => row.value.length === 0);
};

export const useSnapshot = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const fetchSnapshots = async () => {
    const c = collection(db, "snapshots");
    const q = query(c, orderBy("timestamp", "asc"));
    setSnapshots(
      (await getDocs(q)).docs.map((doc) => {
        const snapshot: Snapshot = doc.data() as Snapshot;
        snapshot.id = doc.id;
        return snapshot;
      })
    );
  };

  const addSnapshot = async (snapshot: Snapshot) => {
    let savedSnapshot: Snapshot | undefined = undefined;
    if (isValid(snapshot)) {
      delete snapshot.id;
      snapshot.timestamp = new Date().getTime();
      const c = collection(db, "snapshots");
      const docRef = await addDoc(c, snapshot);
      savedSnapshot = (await getDoc(docRef)).data() as Snapshot;
      savedSnapshot.id = docRef.id;
      setSnapshots((previous) => {
        const snapshots = [...previous];
        if (savedSnapshot) {
          snapshots.push(savedSnapshot);
        }
        return snapshots;
      });
    }
    return savedSnapshot;
  };

  const updateSnapshot = async (index: number, snapshot: Snapshot) => {
    let updatedSnapshot: Snapshot | undefined = undefined;
    if (isValid(snapshot)) {
      const { id, ...data } = snapshot;
      const c = collection(db, "snapshots");
      await setDoc(doc(c, id), data, { merge: true });
      updatedSnapshot = snapshot;
      setSnapshots((previous) => {
        const snapshots = [...previous];
        snapshots[index] = snapshot;
        return snapshots;
      });
    }
    return updatedSnapshot;
  };

  const deleteSnapshot = async (snapshot: Snapshot) => {
    const c = collection(db, "snapshots");
    await deleteDoc(doc(c, snapshot.id));
    setSnapshots((previous) => {
      return previous.filter((s) => s.id !== snapshot.id);
    });
  };

  return { snapshots, addSnapshot, updateSnapshot, deleteSnapshot };
};
