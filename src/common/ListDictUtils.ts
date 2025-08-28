export const isAllEmpty = (dict: { [key: string]: any }) => {
  return Object.values(dict).every(
    (value) => typeof value === "object" && value !== null && Object.keys(value).length === 0
  );
};

export const toList = <T>(dict?: Record<string, T>, sequences?: string[]): [string, T][] => {
  if (!dict) return [];
  const entries = Object.entries(dict) as [string, T][];
  if (sequences?.length) {
    const sequenceSet = new Set(sequences);
    return [
      ...sequences.filter((key) => key in dict).map((key): [string, T] => [key, dict[key]]),
      ...entries.filter(([key]) => !sequenceSet.has(key))
    ];
  }
  return entries;
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
