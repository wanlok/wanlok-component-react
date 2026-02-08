import Fuse from "fuse.js";
import { Item } from "../pages/mapper/useMapper";

export const sortItems = (items: Item[] | null, value: string) => {
  if (!items) {
    return null;
  }
  const fuse = new Fuse(items, {
    keys: ["name"],
    threshold: 1.0,
    includeScore: false
  });
  return fuse.search(value).map((result) => result.item);
};
