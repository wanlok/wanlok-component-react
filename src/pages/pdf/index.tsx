import { usePdf } from "./usePdf";

export const PdfPage = () => {
  const { snapshot } = usePdf();
  return <div>{JSON.stringify(snapshot)}</div>;
};
