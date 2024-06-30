import { Dataset } from "../../common/Types";
import LineChart from "./LineChart";

const year = 2024;

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getDates() {
  const dates = [];
  for (var month = 1; month <= 12; month++) {
    const numberOfDays = new Date(year, month, 0).getDate();
    for (var day = 1; day <= numberOfDays; day++) {
      dates.push(day + " " + monthNames[month - 1] + " " + year);
    }
  }
  return dates;
}

function getValues() {
  const values = [];
  for (var month = 1; month <= 12; month++) {
    const numberOfDays = new Date(year, month, 0).getDate();
    for (var day = 1; day <= numberOfDays; day++) {
      values.push(Math.floor(Math.random() * 100));
    }
  }
  return values;
}

const dataset: Dataset = {
  title: "Peak Efficiency",
  series: [
    {
      name: "Line 1",
      colour: "pink",
      data: getValues(),
    },
    // {
    //   name: "Line 2",
    //   colour: "silver",
    //   data: getValues(),
    // },
  ],
  x: getDates(),
  compareEnabled: true,
};

export default function () {
  return (
    <>
      <div style={{ height: "40px" }}>Chart</div>
      <div style={{ height: "400px" }}>
        <LineChart
          dataset={dataset}
          xFormatter={function (value: string) {
            var label = "";
            if (value != null) {
              const slices = value.split(" ");
              label = slices[0] == "1" ? slices[1] + " " + slices[2] : "";
            }
            return label;
          }}
          chartWidth={function (width: number) {
            const numberOfMonths = 6;
            const scalingFactor = 4392;
            return (
              ((width / dataset.x.length) * scalingFactor) / numberOfMonths
            );
          }}
        />
      </div>
    </>
  );
}
