import { usePDFSnapshot } from "./usePDFSnapshot";

export const PDFPage = () => {
  const { snapshot } = usePDFSnapshot();
  return <div>{JSON.stringify(snapshot)}</div>;
};
