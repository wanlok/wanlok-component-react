import { Dataset } from "../../common/Types";
import LineChart from "./LineChart";

const year = 2024;

function getDates() {
  const dates = [];
  for (var month = 1; month <= 12; month++) {
    const numberOfDays = new Date(year, month, 0).getDate();
    for (var day = 1; day <= numberOfDays; day++) {
      dates.push(day + "-" + month + "-" + year);
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
    {
      name: "Line 2",
      colour: "silver",
      data: getValues(),
    },
  ],
  x: getDates(),
  compareEnabled: true,
};

export default function () {
  return (
    <div style={{ height: "calc(100% - 40px)" }}>
      Chart
      <LineChart
        dataset={dataset}
        xFormatter={function (value: string) {
          return value ? (value.split("-")[0] == "1" ? value : "") : "";
        }}
        chartWidth={function (width: number) {
          const numberOfMonths = 6;
          return ((width / dataset.x.length) * 4400) / numberOfMonths;
        }}
      />
    </div>
  );
}
