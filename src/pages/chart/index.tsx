import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Image, Page, PDFViewer, Document } from "@react-pdf/renderer";
import ApexChartsChart from "./ApexChartsChart";
import RechartsChart from "./RechartsChart";
import { toPng } from "html-to-image";
import { usePDF } from "react-to-pdf";
import { BarChart } from "@mui/x-charts";
import LabelsAboveBars from "./LabelsAboveBars";

const Chart = () => {
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
    <div>
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
        <Typography variant="h4">What is Lorem Ipsum?</Typography>
        <Typography variant="body1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Typography>
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
        <Typography variant="body1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Typography>
        <Typography variant="body1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Typography>
        <Typography variant="body1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Typography>
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
        <Typography variant="body1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Typography>
        <Typography variant="body1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Typography>
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
        <Typography variant="body1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Typography>
        <Typography variant="body1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Typography>
        <Typography variant="body1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Typography>
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

export default Chart;
