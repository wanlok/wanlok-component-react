import { Button } from "@mui/material";
import ApexChartDemo from "./ApexChartDemo";
import { useState } from "react";
import { Image, Page, PDFViewer, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

export default function () {
  const [src, setSrc] = useState<string>();

  const handleExport = async () => {
    const apexChart = ApexCharts.getChartByID("dummy");
    if (apexChart) {
      // const svgString = apexChart.exports.getSvgString(1);
      const dataURI = await apexChart.exports.dataURI();
      if ("imgURI" in dataURI) {
        setSrc(dataURI.imgURI);
      }
    }
  };

  return (
    <>
      <div>Hello World 1234</div>
      <Button variant="contained" onClick={handleExport}>
        Export Chart
      </Button>
      <div></div>
      {src && (
        <PDFViewer style={{ width: "100%", height: "100%" }}>
          <Document>
            <Page size="A4">
              <Image src={src} />
            </Page>
          </Document>
        </PDFViewer>
      )}
      <div style={{ visibility: "hidden", position: "absolute", top: "-9999px" }}>
        <ApexChartDemo id={"dummy"} animated={false} />
      </div>
    </>
  );
}
