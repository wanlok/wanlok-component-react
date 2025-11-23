import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Attributes, CloudinaryFileInfo, CollectionAttributes, Folder, TypedAttributes } from "../../services/Types";

interface Banknote {
  name: string;
  url: string;
  w: number;
  h: number;
}

const parseAttributes = (collectionAttributes: CollectionAttributes, attributes: Attributes | undefined) => {
  let typedAttributes: TypedAttributes = { w: 0, h: 0 };

  collectionAttributes.forEach(({ name, type }) => {
    const value = attributes?.[name];
    if (value) {
      if (type === "number") {
        typedAttributes[name] = Number(value);
      } else {
        typedAttributes[name] = value;
      }
    }
  });

  return typedAttributes as { w: number; h: number };
};

const getAttributes = async () => {
  const data = (await getDoc(doc(db, "configs", "folders"))).data() as { folders: Folder[] } | undefined;
  const folder = data?.folders.find((folder) => folder.name === "Banknotes");

  if (!folder) {
    return [];
  }

  return folder.attributes;
};

const getBanknotes = async (collectionAttributes: CollectionAttributes) => {
  const data = (await getDoc(doc(db, "collections", "banknotes"))).data() as
    | {
        files: Record<string, CloudinaryFileInfo>;
      }
    | undefined;

  if (!data) {
    return [];
  }

  return Object.values(data.files).map(({ name, url, attributes }) => {
    return { name, url, ...parseAttributes(collectionAttributes, attributes) };
  });
};

export const useBanknoteAPI = () => {
  const [banknotes, setBanknotes] = useState<Banknote[]>([]);

  const fetch = async () => {
    setBanknotes(await getBanknotes(await getAttributes()));
  };

  useEffect(() => {
    fetch();
  }, []);

  return { jsonString: JSON.stringify(banknotes) };
};

export const BanknoteAPI = () => {
  const { jsonString } = useBanknoteAPI();
  return <>{jsonString}</>;
};
