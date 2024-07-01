import { Dataset } from "../../common/Types";
import LineChart from "./LineChart";

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

function getNumberOfMonths(startDate: Date, endDate: Date) {
  const yearMonthSet: Set<string> = new Set();
  while (startDate <= endDate) {
    yearMonthSet.add(
      startDate.getFullYear() + `${startDate.getMonth() + 1}`.padStart(2, "0")
    );
    startDate.setDate(startDate.getDate() + 1);
  }
  return yearMonthSet.size;
}

function getDatesBetweenDateString(
  startDateString: string,
  endDateString: string
) {
  const dates = [];
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  while (startDate <= endDate) {
    dates.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }
  return dates;
}

function getValues(dates: Date[]) {
  const values = [];
  if (dates.length > 0) {
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    const numberOfDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    for (var i = 0; i < numberOfDays; i++) {
      values.push(Math.floor(Math.random() * 100));
    }
  }
  return values;
}

function getDateString(date: Date) {
  const day = date.getDate();
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return day + " " + monthName + " " + year;
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

export default function () {
  const dates = getDatesBetweenDateString("2024-06-05", "2025-07-12");
  const firstDateString = dates.length > 0 ? getDateString(dates[0]) : "";
  const dataset: Dataset = {
    title: "Peak Efficiency",
    series: [
      {
        name: "Line 1",
        colour: "pink",
        data: getValues(dates),
      },
      // {
      //   name: "Line 2",
      //   colour: "silver",
      //   data: getValues(),
      // },
    ],
    x: getDateStrings(dates),
    compareEnabled: true,
  };

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
              label =
                value == firstDateString || slices[0] == "1"
                  ? slices[1] + " " + slices[2]
                  : "";
            }
            return label;
          }}
          chartWidth={function (width: number) {
            const numberOfMonthsToDisplay = 6;
            const scalingFactor = 4392;
            return (
              ((width / dataset.x.length) * scalingFactor) /
              numberOfMonthsToDisplay
            );
          }}
        />
      </div>
    </>
  );
}
