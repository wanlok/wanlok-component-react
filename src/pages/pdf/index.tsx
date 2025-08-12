import { usePDFSnapshot } from "./usePDFSnapshot";
import { BarChart } from "@mui/x-charts";
import { usePDF } from "react-to-pdf";
import { useEffect } from "react";

export const PDFPage = () => {
  const { snapshot } = usePDFSnapshot();

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  useEffect(() => {
    const timeout = setTimeout(() => {
      toPDF();
    }, 500);
    return () => clearTimeout(timeout);
  }, [snapshot]);

  return (
    <>
      <div ref={targetRef}>
        {snapshot?.rows.map((row) => {
          if (row.type === "barchart") {
            return <BarChart {...JSON.parse(row.value)} barLabel="value" />;
          } else {
            return <div>{row.value}</div>;
          }
        })}
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "white" }}>
        Downloading...
      </div>
    </>
  );
};
