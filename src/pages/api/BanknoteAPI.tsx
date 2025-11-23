import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { CloudinaryFileInfo, CollectionAttributes, Folder } from "../../services/Types";

const collectionName = "collections";
const documentId = "banknotes";

interface Banknote {
  name: string;
  url: string;
}

const getAttributes = async () => {
  let attributes: CollectionAttributes = [];

  const data = (await getDoc(doc(db, "configs", "folders"))).data() as { folders: Folder[] } | undefined;

  if (data) {
    const folder = data.folders.find((folder) => folder.name === "Banknotes");
    if (folder?.attributes) {
      attributes = folder?.attributes;
    }
  }

  return attributes;
};

const getBanknotes = async (collectionAttributes: CollectionAttributes) => {
  let banknotes: Banknote[] = [];

  const data = (await getDoc(doc(db, collectionName, documentId))).data() as
    | {
        files: Record<string, CloudinaryFileInfo>;
      }
    | undefined;

  if (data) {
    for (const { name, url, attributes } of Object.values(data.files)) {
      let newAttributes: { [key: string]: number | string } = {};
      collectionAttributes.map(({ name, type }) => {
        let typedValue;
        let value = attributes?.[name];
        if (type === "number" && value) {
          typedValue = Number(value);
        } else {
          typedValue = value;
        }
        if (typedValue) {
          newAttributes[name] = typedValue;
        }
      });
      banknotes.push({ name, url, ...newAttributes });
    }
  }

  return banknotes;
};

export const useAPI = () => {
  const [list, setList] = useState<Banknote[]>([]);

  const fetch = async () => {
    setList(await getBanknotes(await getAttributes()));
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
