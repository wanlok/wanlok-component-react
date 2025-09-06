import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Image, Page, PDFViewer, Document } from "@react-pdf/renderer";
import { toPng } from "html-to-image";
import { usePDF } from "react-to-pdf";
import { BarChart } from "@mui/x-charts";
import { RechartsChart } from "./RechartsChart";
import { LabelsAboveBars } from "./LabelsAboveBars";
import { ApexChartsChart } from "./ApexChartsChart";
import { FlashPlayer } from "./FlashPlayer";
import endImage from "./End.png";

export const Chart = () => {
  const [src, setSrc] = useState<string>();

  const [imgSrc, setImgSrc] = useState<string>();

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

  const [swfFilePath, setSwfFilePath] = useState<string>("");

  return (
    <div>
      <FlashPlayer
        filePath={swfFilePath}
        endReferenceImage={endImage}
        onChange={(imageBase64String) => {
          setImgSrc(imageBase64String);
        }}
      />
      {/* <RufflePlayerComponent name={"3dlogicxgen.swf"} /> */}
      <Button
        variant="contained"
        onClick={() => {
          setSwfFilePath("/yakijuju.swf");
        }}
      >
        Start Game
      </Button>
      {/* <Button
        variant="contained"
        onClick={() => {
          setSwfPath("/103.swf");
        }}
      >
        Start Game
      </Button> */}
      <img src={imgSrc} alt="" />
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
        <PDFViewer style={{ width: "100%", height: "800px" }}>
          <Document>
            <Page size="A4">
              <Image src={src} />
            </Page>
          </Document>
        </PDFViewer>
      )}
      <Stack ref={targetRef}>
        <ul>
          <li>
            <img src="https://upload.wikimedia.org/wikipedia/zh/3/32/Yahoo_HK_Logo_2019.png" alt="" />
            <a href="https://www.yahoo.com.hk">Yahoo!</a>
          </li>
          <li>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/280px-Google_2015_logo.svg.png"
              alt=""
            />
            <a href="https://www.google.com">Google</a>
          </li>
        </ul>
        <Typography variant="h4">MUI Bar Chart</Typography>
        <BarChart
          xAxis={[{ data: ["group A", "group B", "group C"] }]}
          series={[
            { data: [4, 3, 5], label: "Series 1" },
            { data: [1, 6, 3], label: "Series 2" },
            { data: [2, 5, 6], label: "Series 3" }
          ]}
          barLabel="value"
          height={300}
        />
        <Stack direction="row" sx={{}}>
          <LabelsAboveBars />
          <BarChart
            xAxis={[{ data: ["group A", "group B", "group C"] }]}
            series={[{ data: [4, 3, 5], label: "Series 1" }]}
            barLabel="value"
            height={400}
            sx={{ flex: 0.5 }}
          />
        </Stack>
        <Stack direction="row" sx={{}}>
          <LabelsAboveBars />
          <BarChart
            xAxis={[{ data: ["group A", "group B", "group C"] }]}
            series={[{ data: [4, 3, 5], label: "Series 1" }]}
            barLabel="value"
            height={400}
            sx={{ flex: 0.5 }}
          />
        </Stack>
        <Stack direction="row" sx={{}}>
          <LabelsAboveBars />
          <BarChart
            xAxis={[{ data: ["group A", "group B", "group C"] }]}
            series={[{ data: [4, 3, 5], label: "Series 1" }]}
            barLabel="value"
            height={400}
            sx={{ flex: 0.5 }}
          />
        </Stack>
      </Stack>
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
};
