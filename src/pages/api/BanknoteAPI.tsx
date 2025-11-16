import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { CloudinaryFileInfo } from "../../services/Types";

const collectionName = "collections";
const documentId = "banknotes";

interface Banknote {
  name: string;
  url: string;
}

export const useAPI = () => {
  const [list, setList] = useState<Banknote[]>([]);

  const fetch = async () => {
    const data = (await getDoc(doc(db, collectionName, documentId))).data();

    if (!data) {
      return;
    }

    const list: Banknote[] = [];

    for (const [_, { name, url }] of Object.entries(data.files as Record<string, CloudinaryFileInfo>)) {
      list.push({ name, url });
    }

    setList(list);
  };

  useEffect(() => {
    fetch();
  }, []);

  return { list };
};

export const BanknoteAPI = () => {
  const { list } = useAPI();
  return <>{JSON.stringify(list)}</>;
};
