import { CollectionAttributes } from "../services/Types";

export const getVisibleAttributeText = (
  folderAttributes: CollectionAttributes,
  attributes: { [key: string]: string } | undefined
): string => {
  if (!attributes) {
    return "";
  }
  return folderAttributes
    .filter(({ visible }) => visible)
    .map(({ name }) => attributes[name])
    .filter((value) => value)
    .join(" / ");
};
