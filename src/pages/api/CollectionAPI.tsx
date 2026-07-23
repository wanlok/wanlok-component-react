import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { CollectionDocument, CollectionAttributes, Folder, TypedAttributes } from "../../services/Types";
import { setTypedAttributes } from "../../common/setTypedAttributes";
import { toSlug } from "../../common/StringUtils";

type CollectionItem = Record<string, string | number>;

const getCollectionAttributes = async (id: string) => {
  const data = (await getDoc(doc(db, "configs", "folders"))).data() as { folders: Folder[] } | undefined;
  const folder = data?.folders.find((folder) => toSlug(folder.name) === id);
  return folder?.attributes ?? [];
};

const applyTypedAttributes = (
  base: Record<string, string | number>,
  collectionAttributes: CollectionAttributes,
  attributes: { [key: string]: string } | undefined
): CollectionItem => {
  const typedAttributes: TypedAttributes = {};
  setTypedAttributes(typedAttributes, collectionAttributes, attributes);
  return { ...base, ...typedAttributes };
};

const getCollectionItems = async (id: string, collectionAttributes: CollectionAttributes) => {
  const data = (await getDoc(doc(db, "collections", id))).data() as CollectionDocument | undefined;

  if (!data) {
    return {};
  }

  const result: Record<string, CollectionItem> = {};

  Object.entries(data.files).forEach(([key, { name, url, attributes }]) => {
    result[key] = applyTypedAttributes({ name, url }, collectionAttributes, attributes);
  });

  Object.entries(data.youtube_regular).forEach(([key, { name, imageUrl, attributes }]) => {
    result[key] = applyTypedAttributes({ name, imageUrl }, collectionAttributes, attributes);
  });

  Object.entries(data.youtube_shorts).forEach(([key, { name, imageUrl, attributes }]) => {
    result[key] = applyTypedAttributes({ name, imageUrl }, collectionAttributes, attributes);
  });

  Object.entries(data.steam).forEach(([key, { name, imageUrl, attributes }]) => {
    result[key] = applyTypedAttributes({ name, imageUrl }, collectionAttributes, attributes);
  });

  return result;
};

export const useCollectionAPI = (id: string | undefined) => {
  const [items, setItems] = useState<Record<string, CollectionItem>>({});

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchItems = async () => {
      setItems(await getCollectionItems(id, await getCollectionAttributes(id)));
    };
    fetchItems();
  }, [id]);

  return { jsonString: JSON.stringify(items) };
};

export const CollectionAPI = () => {
  const { id } = useParams();
  const { jsonString } = useCollectionAPI(id);
  return <>{jsonString}</>;
};
