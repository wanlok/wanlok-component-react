import { useLocation } from "react-router-dom";
import { usePDFSnapshot } from "./usePDFSnapshot";
import { BarChart } from "@mui/x-charts";
import { usePDF } from "react-to-pdf";
import { useEffect } from "react";

export const PDFPage = () => {
  const location = useLocation();
  const view = new URLSearchParams(location.search).get("view");
  const { snapshot } = usePDFSnapshot();

  const { toPDF, targetRef } = usePDF({
    filename: "page.pdf",
    page: {
      orientation: "landscape"
    }
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (!view) {
      timeout = setTimeout(() => {
        toPDF();
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [view, snapshot, toPDF]);

  return (
    <>
      <div ref={targetRef}>
        {snapshot?.rows.map((row, i) => {
          if (row.type === "barchart") {
            return <BarChart key={`pdf-${i}`} {...JSON.parse(row.value)} barLabel="value" />;
          } else {
            return <div key={`pdf-${i}`}>{row.value}</div>;
          }
        })}
      </div>
      {!view && (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "white" }}>
          Downloading...
        </div>
      )}
    </>
  );
};
