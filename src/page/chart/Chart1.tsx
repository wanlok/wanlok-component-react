import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import ReactApexChart, { Props as ChartProps } from "react-apexcharts";
import getDimension from "../../common/getDimension";

interface Series {
  series: any;
  seriesIndex: number;
  dataPointIndex: number;
  w: any;
}

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

const areaChartOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  grid: {
    show: true,
    borderColor: "#5F6274",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },
  xaxis: {
    tooltip: {
      enabled: false,
    },
    scrollbar: {
      enabled: true,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      style: {
        // colors: ["white"],
      },
    },
  },
  tooltip: {
    custom: function (series: Series) {
      return ReactDOMServer.renderToString(Tooltip(series));
    },
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    fontFamily: `'Roboto', sans-serif`,
    position: "top",
    horizontalAlign: "left",
    labels: {
      // colors: "white",
    },
    onItemClick: {
      toggleDataSeries: false,
    },
    onItemHover: {
      highlightDataSeries: false,
    },
    formatter: function (seriesName: string, opts: any) {
      return ReactDOMServer.renderToString(Legend(seriesName, opts));
    },
    markers: {
      width: 0,
      height: 0,
      radius: 0,
    },
    itemMargin: {
      horizontal: 0,
    },
  },
  colors: ["#8473FE", "#00F0FF"],
};

function Tooltip({ series, seriesIndex, dataPointIndex, w }: Series) {
  const dot = {
    display: "inline-block",
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: -3,
    marginRight: 6,
    verticalAlign: "middle",
  };
  return (
    <div>
      <div
        style={{
          borderBottom: "#FFFFFF33 solid 1px",
          padding: "8px 8px 4px 8px",
        }}
      >
        {w.globals.categoryLabels[dataPointIndex]}
      </div>
      {series.map((s: any, i: number) => {
        const colour = w.config.colors[i];
        const name = w.config.series[i].name;
        const value = s[dataPointIndex];
        return (
          <div
            style={{
              padding: "8px 8px " + (i == series.length - 1 ? 8 : 0) + "px 8px",
            }}
          >
            <span style={{ ...dot, backgroundColor: colour }}></span>
            {series.length > 1 ? name + ": " + value : value}
          </div>
        );
      })}
    </div>
  );
}

function Legend(seriesName: string, opts: any) {
  const line = {
    display: "inline-block",
    width: 24,
    height: 4,
    backgroundColor: opts.w.globals.colors[opts.seriesIndex],
    marginTop: -4,
    marginLeft: 12,
    marginRight: 8,
    verticalAlign: "middle",
  };
  return (
    <>
      {seriesName}
      <span style={line}></span>
    </>
  );
}

export default function () {
  const [options, setOptions] = useState<ChartProps>(areaChartOptions);
  const { ref, width } = getDimension();
  const numberOfMonths = 6;
  const chartWidth = ((width / dataset["x"].length) * 4400) / numberOfMonths;

  useEffect(() => {
    var legend = {};
    if (dataset["series"].length == 1) {
      legend = {
        legend: {
          formatter: function (seriesName: string, opts: any) {
            return null;
          },
        },
      };
    }
    var annotations = {};
    // annotations: {
    //     yaxis: [
    //         {
    //             y: 70,
    //             borderColor: 'red'
    //         }
    //     ]
    // },
    setOptions((prevState) => ({
      ...prevState,
      xaxis: {
        // labels: {
        //   style: {
        //     colors: getColours("white", 6),
        //   },
        // },
        categories: dataset["x"],
        // tickAmount: visiblePoints,
        labels: {
          formatter: function (value: any) {
            if (value) {
              const slices = value.split("-");
              return slices[0] == "1" ? value : "";
            } else {
              return "";
            }
          },
        },
      },
      ...legend,
      ...annotations,
    }));
  }, []);

  return (
    <div ref={ref} style={{ overflowX: "auto", overflowY: "hidden" }}>
      <div style={{ minWidth: chartWidth + "px" }}>
        <ReactApexChart
          options={options}
          series={dataset["series"]}
          type="area"
          height={400}
        />
      </div>
    </div>
  );
}
