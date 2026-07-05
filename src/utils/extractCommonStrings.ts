const separators = [" - ", " | ", ": ", " – "];

export const extractCommonStrings = (strings: string[]): string[] => {
  const counts: Record<string, number> = {};
  for (const string of strings) {
    for (const separator of separators) {
      const index = string.indexOf(separator);
      if (index > 0) {
        const prefix = string.substring(0, index).trim();
        counts[prefix] = (counts[prefix] ?? 0) + 1;
        break;
      }
    }
  }
  return Object.entries(counts)
    .filter(([, count]) => count > 1)
    .map(([prefix]) => prefix)
    .sort();
};
