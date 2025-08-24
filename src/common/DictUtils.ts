export const isAllEmpty = (dict: { [key: string]: any }) => {
  return Object.values(dict).every(
    (value) => typeof value === "object" && value !== null && Object.keys(value).length === 0
  );
};

export const toList = (dict?: { [key: string]: any }) => {
  return dict ? Object.entries(dict) : [];
};
