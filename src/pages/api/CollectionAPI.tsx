import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  ApiResponse,
  CollectionDocument,
  CollectionAttributes,
  Folder,
  Quiz,
  Region,
  TypedAttributes
} from "../../services/Types";
import { setTypedAttributes } from "../../common/setTypedAttributes";
import { toSlug } from "../../common/StringUtils";
import { splitAnswers } from "../../utils/splitAnswers";

type CollectionItem = Record<string, string | number | Quiz[]>;

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

const getQuiz = (layout: string | undefined, regions: Region[] | undefined): Quiz[] | undefined => {
  if (layout !== "quiz" || !regions) {
    return undefined;
  }
  const quiz: Quiz[] = [];
  let collectingQuestion = false;
  regions.forEach((region) => {
    const type = region.type ?? "question";
    if (type === "question") {
      const currentEntry = quiz[quiz.length - 1];
      if (currentEntry && collectingQuestion) {
        currentEntry.question.push({ type: "text", value: region.recognisedText ?? "" });
      } else {
        quiz.push({ question: [{ type: "text", value: region.recognisedText ?? "" }], answers: [] });
        collectingQuestion = true;
      }
      return;
    }
    if (type !== "answers") {
      return;
    }
    const currentEntry = quiz[quiz.length - 1];
    if (!currentEntry) {
      return;
    }
    collectingQuestion = false;
    splitAnswers(region.recognisedText ?? "", region.delimiter ?? "letterDot").forEach((text, i) => {
      currentEntry.answers.push({
        content: [{ type: "text", value: text }],
        correct: region.correctAnswerIndices?.includes(i) ?? false
      });
    });
  });
  return quiz;
};

const filterCollectionItems = (
  result: Record<string, CollectionItem>,
  collectionAttributes: CollectionAttributes,
  filters: [string, string][]
): Record<string, CollectionItem> => {
  if (filters.length === 0) {
    return result;
  }
  return Object.fromEntries(
    Object.entries(result).filter(([, item]) =>
      filters.every(([paramKey, paramValue]) => {
        const attribute = collectionAttributes.find((a) => toSlug(a.name) === paramKey);
        if (!attribute) {
          return false;
        }
        return toSlug(String(item[attribute.name] ?? "")) === toSlug(paramValue);
      })
    )
  );
};

const getCollectionItems = async (id: string, collectionAttributes: CollectionAttributes, filters: [string, string][]) => {
  const data = (await getDoc(doc(db, "collections", id))).data() as CollectionDocument | undefined;

  if (!data) {
    return {};
  }

  const result: Record<string, CollectionItem> = {};

  Object.entries(data.files).forEach(([key, { name, url, attributes, layout, regions }]) => {
    const item = applyTypedAttributes({ name, url }, collectionAttributes, attributes);
    const quiz = getQuiz(layout, regions);
    result[key] = quiz ? { ...item, quiz } : item;
  });

  Object.entries(data.youtubeRegular).forEach(([key, { name, imageUrl, attributes }]) => {
    result[key] = applyTypedAttributes({ name, imageUrl }, collectionAttributes, attributes);
  });

  Object.entries(data.youtubeShorts).forEach(([key, { name, imageUrl, attributes }]) => {
    result[key] = applyTypedAttributes({ name, imageUrl }, collectionAttributes, attributes);
  });

  Object.entries(data.steam).forEach(([key, { name, imageUrl, attributes }]) => {
    result[key] = applyTypedAttributes({ name, imageUrl }, collectionAttributes, attributes);
  });

  return filterCollectionItems(result, collectionAttributes, filters);
};

const useCollectionAPI = (id: string | undefined, filters: [string, string][]) => {
  const [items, setItems] = useState<Record<string, CollectionItem>>({});
  const [status, setStatus] = useState("loading");
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    if (!id) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting to "loading" before a fetch, same shape as React's own data-fetching docs example
    setStatus("loading");
    const fetchItems = async () => {
      const collectionItems = await getCollectionItems(id, await getCollectionAttributes(id), filters);
      setItems(collectionItems);
      setStatus("ok");
    };
    fetchItems();
    // filtersKey (not filters) is intentional: filters is a fresh array reference on every call, filtersKey is the stable value to key the effect on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, filtersKey]);

  const response: ApiResponse<Record<string, CollectionItem>> = { status, data: items };
  return { jsonString: JSON.stringify(response) };
};

export const CollectionAPI = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { jsonString } = useCollectionAPI(id, [...searchParams.entries()]);
  return <>{jsonString}</>;
};
