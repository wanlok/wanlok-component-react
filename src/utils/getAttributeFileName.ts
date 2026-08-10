export const getAttributeFileName = (attributes: { [key: string]: string } | undefined): string | null => {
  if (!attributes) {
    return null;
  }
  const entry = Object.entries(attributes).find(([key]) => key.includes("File"));
  return entry?.[1] ?? null;
};
