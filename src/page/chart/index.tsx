import { Button, Typography } from "@mui/material";
import { CSSProperties, useState } from "react";
import { Image, Page, PDFViewer, Document, Svg } from "@react-pdf/renderer";
import ApexChartsChart from "./ApexChartsChart";
import RechartsChart from "./RechartsChart";
import { toPng, toSvg } from "html-to-image";
import { usePDF } from "react-to-pdf";

export default function () {
  const [src, setSrc] = useState<string>();

  const exportRechartsChart = async () => {
    const element = document.getElementById("recharts-container");
    if (element) {
      setSrc(await toPng(element, { pixelRatio: 3 }));
    }
  };

  const exportApexChartsChart = async () => {
    const apexChart = ApexCharts.getChartByID("dummy");
    if (apexChart) {
      const dataURI = await apexChart.exports.dataURI({ scale: 3 });
      if ("imgURI" in dataURI) {
        setSrc(dataURI.imgURI);
      }
    }
  };

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  return (
    <div ref={targetRef}>
      <Button variant="contained" onClick={() => toPDF()}>
        Export Entire Page as PDF
      </Button>
      <Button variant="contained" onClick={exportRechartsChart}>
        Export Recharts Chart
      </Button>
      <Button variant="contained" onClick={exportApexChartsChart}>
        Export Apex Charts Chart
      </Button>
      {src && (
        <PDFViewer style={{ width: "100%", height: "100%" }}>
          <Document>
            <Page size="A4">
              <Image src={src} />
            </Page>
          </Document>
        </PDFViewer>
      )}
      <Typography variant="h4">Recharts</Typography>
      <div id={"recharts-container"}>
        <RechartsChart />
      </div>
      <Typography variant="h4">ApexCharts</Typography>
      <div>
        <ApexChartsChart id={"dummy"} animated={false} />
      </div>
    </div>
  );
}
