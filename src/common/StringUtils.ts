export const extractUrlStrings = (text: string, regex: RegExp, exclude?: string[]): string[] => {
  const urlStrings = text.match(regex) ?? [];
  const set = new Set(exclude);
  return urlStrings.filter((urlString) => !set.has(urlString));
};
