import { Button } from "@mui/material";
import { useRef } from "react";
import ExampleChart from "./Chart2";
import { toPng } from "html-to-image";
import { createRoot } from "react-dom/client";

export default function () {
  const chartRef = useRef(null);

  const tempContainer = document.createElement("div");
  tempContainer.style.position = "fixed";
  tempContainer.style.left = "-9999px";
  tempContainer.style.top = "0px";
  tempContainer.style.width = "600px";
  tempContainer.style.height = "400px";
  document.body.appendChild(tempContainer);

  const handleExport = async () => {
    console.log("handleExport");
    if (!chartRef.current) return;
    try {
      const root = createRoot(tempContainer);
      root.render(<ExampleChart />);
      const dataUrl = await toPng(chartRef.current);
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <>
      <div>Hello World 1234</div>
      <Button
        variant="contained"
        onClick={() => {
          handleExport();
        }}
      >
        Click
      </Button>
      {/* <PDFViewer style={{ width: "100%", height: "calc(100% - 20px)" }}>
        <SomeComponent />
      </PDFViewer> */}
    </>
  );
}
