import { Dataset } from "../../common/Types";
import { getDateString } from "../../common/DateUtils";
import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { apexChartProps, setGridColour, setTooltip, setX, setYColour } from "./LineChart";
import ReactApexChart from "react-apexcharts";
import { Document, Page, PDFViewer, Text } from "@react-pdf/renderer";
import Html from "react-pdf-html";
import ReactDOMServer from "react-dom/server";
import { SomeComponent } from "./SomeComponent";
import { toPng } from "html-to-image";
import { RechartsChart } from "./RechartsChart";

function getNumberOfDays(dates: Date[]) {
  var numberOfDays = 0;
  if (dates.length > 0) {
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    let diff = endDate.getTime() - startDate.getTime();
    numberOfDays = Math.round(diff / (1000 * 3600 * 24)) + 1;
  }
  return numberOfDays;
}

function getDatesBetweenDateStrings(startDateString: string, endDateString: string) {
  const dates = [];
  const startDate = new Date(startDateString);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(endDateString);
  endDate.setHours(0, 0, 0, 0);
  while (startDate <= endDate) {
    dates.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }
  return dates;
}

function getValues(dates: Date[]) {
  const values = [];
  const numberOfDays = getNumberOfDays(dates);
  for (var i = 0; i < numberOfDays; i++) {
    values.push(Math.floor(Math.random() * 100));
  }
  return values;
}

function getDateStrings(dates: Date[]) {
  const dateStrings = [];
  if (dates.length > 0) {
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    while (startDate <= endDate) {
      dateStrings.push(getDateString(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
  }
  return dateStrings;
}

const getWeekNumber = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;

  // Week starts on Monday (ISO week date system)
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

const generateData = (myNumber: number, value: any) => {
  const my_list = [];
  for (var i = 0; i < myNumber; i++) {
    my_list.push(value);
  }
  return my_list;
};

export const DummyChart1 = () => {
  const startDateString = "2024-07-01";
  const endDateString = "2024-08-31";

  const [options, setOptions] = useState(apexChartProps);

  var series: ApexAxisChartSeries;
  var x: string[];

  series = [
    {
      name: "Line 1",
      data: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    },
    {
      name: "Line 2",
      data: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
    }
  ];

  x = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const numberOfPoints: number = x.length;
  var numberOfPointsToShow: number = numberOfPoints;

  // const [series, setSeries] = useState<any>(dataset);

  // xLabelOffset={1.6}
  // xFormatter={function (value: string) {
  //     var label = "";
  //     if (value != null) {
  //         const slices = value.split(" ");
  //         // label =
  //         //     value == firstDateString || slices[0] == "1"
  //         //         ? slices[1] + " " + slices[2]
  //         //         : "";

  //         if (parseInt(slices[0]) % 2 === 0) {
  //             label = slices[0];
  //         }
  //     }

  //     return label;
  // }}

  useEffect(() => {
    setYColour(options, "gold");
    setGridColour(options, "blue");
    setX(options, series, x, "#000000", 0, (value: string) => value);
    setTooltip(options, x);
    setOptions({ ...options });
  }, []);

  const html = `<html>
  <body>
    <h1>Chart Example</h1>
    <div>Hello World</div>
  </body>
</html>
`;

  const chartRef = useRef(null);

  const handleExport = async () => {
    if (!chartRef.current) return;
    try {
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
    // <>
    //   <div>Chart</div>
    //   <div style={{ height: "400px" }}>
    //     {/* <LineChart
    //       options={options}
    //       series={series}
    //       x={x}
    //       xLabelOffset={0}
    //       xFormatter={(value: string) => {
    //         return value;
    //       }}
    //       chartWidth={(width: number) => {
    //         const fullWidth = 12;
    //         const pointWidth = 12;
    //         const scale =
    //           numberOfPoints > numberOfPointsToShow ? (fullWidth * numberOfPointsToShow) / numberOfPoints : fullWidth;
    //         // return (width * pointWidth) / scale;
    //         return width / 2;
    //       }}
    //     /> */}
    //     <ReactApexChart options={options} series={series} type="area" height="100%" width="100%" />
    //   </div>
    // </>
    // <PDFViewer style={{ width: "100%", height: "calc(100% - 20px)" }}>
    //   <Document>
    //     <Page>
    //       <Html
    //         children={ReactDOMServer.renderToStaticMarkup(
    //           <>
    //             <div>Chart</div>
    //             <div style={{ height: "400px" }}>
    //               <ReactApexChart options={options} series={series} type="area" height="100%" width="100%" />
    //             </div>
    //           </>
    //         )}
    //       />
    //     </Page>
    //   </Document>
    // </PDFViewer>
    <>
      <div>Hello World</div>
      <Button
        variant="contained"
        onClick={() => {
          handleExport();
        }}
      >
        Click
      </Button>
      <div ref={chartRef}>
        <RechartsChart />
      </div>
      {/* <PDFViewer style={{ width: "100%", height: "calc(100% - 20px)" }}>
        <SomeComponent />
      </PDFViewer> */}
    </>
  );
};
