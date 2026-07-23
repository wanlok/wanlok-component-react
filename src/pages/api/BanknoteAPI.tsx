import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Attributes, CloudinaryFileInfo, CollectionAttributes, Folder, TypedAttributes } from "../../services/Types";
import { setTypedAttributes } from "../../common/setTypedAttributes";

interface Banknote {
  name: string;
  url: string;
  width: number;
  height: number;
}

const parseAttributes = (collectionAttributes: CollectionAttributes, attributes: Attributes | undefined) => {
  let typedAttributes: TypedAttributes = { width: 0, height: 0 };
  setTypedAttributes(typedAttributes, collectionAttributes, attributes);
  return typedAttributes as { width: number; height: number };
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
    return {};
  }

  let dict: Record<string, Banknote> = {};

  Object.keys(data.files).forEach((key) => {
    const { name, url, attributes } = data.files[key];
    const { width, height } = parseAttributes(collectionAttributes, attributes);
    if (width > 0 && height > 0) {
      dict[key] = { name, url, width, height };
    }
  });

  return dict;
};

export const useBanknoteAPI = () => {
  const [banknotes, setBanknotes] = useState<Record<string, Banknote>>({});

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
