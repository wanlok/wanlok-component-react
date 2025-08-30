export const seperate = (list: [string, any][][], current: [string, any][]) => {
  const sum = list
    .slice(0, list.indexOf(current))
    .map((l) => l.length)
    .reduce((s, length) => s + length, 0);
  return sum > 0 && current.length > 0 ? "1px" : 0;
};
