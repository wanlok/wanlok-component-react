import Chart1 from "./Chart1";

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

const dataset: any = {
  title: "Peak Efficiency",
  series: [
    {
      name: "Line 1",
      data: getValues(),
    },
  ],
  x: getDates(),
  compareEnabled: true,
};

export default function () {
  return (
    <div>
      Chart
      <Chart1 dataset={dataset} />
    </div>
  );
}
