export const isAllEmpty = (dict: { [key: string]: any }) => {
  return Object.values(dict).every(
    (value) => typeof value === "object" && value !== null && Object.keys(value).length === 0
  );
};

export const toList = (dict?: { [key: string]: any }) => {
  return dict ? Object.entries(dict) : [];
};

export const groupList = (list: any[], numberOfItemPerGroup: number) => {
  return list.reduce((a, item, index) => {
    const i = Math.floor(index / numberOfItemPerGroup);
    if (!a[i]) {
      a[i] = [];
    }
    a[i].push(item);
    return a;
  }, [] as Array<Array<any>>);
};
