import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import ReactApexChart, { Props as ApexChartProps } from "react-apexcharts";
import getDimension from "../../common/getDimension";
import { Dataset } from "../../common/Types";
import classes from "./LineChart.module.css";

interface Series {
  series: ApexAxisChartSeries;
  dataPointIndex: number;
  w: any;
}

const apexChartProps = {
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
  legend: {
    show: true,
    showForSingleSeries: true,
    position: "top",
    horizontalAlign: "left",
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
};

function Tooltip(dataset: Dataset, { series, dataPointIndex, w }: Series) {
  return (
    <div>
      <div className={classes["tooltip-top"]}>{dataset.x[dataPointIndex]}</div>
      {series.map((s: any, i: number) => {
        const colour = w.config.colors[i];
        const name = w.config.series[i].name;
        const value = s[dataPointIndex];
        return (
          <div
            className={classes["tooltip-content"]}
            style={{
              paddingBottom: i == series.length - 1 ? 8 : 0 + "px",
            }}
          >
            <span
              className={classes["tooltip-dot"]}
              style={{ backgroundColor: colour }}
            ></span>
            {series.length > 1 ? name + ": " + value : value}
          </div>
        );
      })}
    </div>
  );
}

function Legend(seriesName: string, opts: any) {
  const colour = opts.w.globals.colors[opts.seriesIndex];
  return (
    <>
      {seriesName}
      <span
        className={classes.legend}
        style={{
          backgroundColor: colour,
        }}
      ></span>
    </>
  );
}

function setX(
  dataset: Dataset,
  colour: string,
  formatter: (value: string) => string
) {
  return {
    xaxis: {
      categories: dataset.x,
      labels: {
        formatter: formatter,
        style: {
          colors: Array.from({ length: dataset.x.length }, () => colour),
        },
      },
    },
    colors: dataset.series.map((series) => series.colour),
  };
}

function setYColour(colour: string) {
  return {
    yaxis: {
      labels: {
        style: {
          colors: [colour],
        },
      },
    },
  };
}

function setGridColour(colour: string) {
  return {
    grid: {
      borderColor: colour,
    },
  };
}

function setLegendHidden(hidden: boolean) {
  var legend;
  if (hidden) {
    legend = {
      legend: {
        formatter: function () {
          return null;
        },
      },
    };
  } else {
    legend = {};
  }
  return legend;
}

function setTooltip(dataset: Dataset) {
  return {
    tooltip: {
      custom: function (series: Series) {
        return ReactDOMServer.renderToString(Tooltip(dataset, series));
      },
    },
  };
}

function setAnnotations() {
  var annotations = {};
  // annotations: {
  //     yaxis: [
  //         {
  //             y: 70,
  //             borderColor: 'red'
  //         }
  //     ]
  // },
  return annotations;
}

export default function ({ dataset }: { dataset: Dataset }) {
  const [options, setOptions] = useState<ApexChartProps>(apexChartProps);
  const { ref, width } = getDimension();
  const numberOfMonths = 6;
  const chartWidth = ((width / dataset.x.length) * 4400) / numberOfMonths;

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      ...setX(dataset, "black", function (value: string) {
        return value ? (value.split("-")[0] == "1" ? value : "") : "";
      }),
      ...setYColour("black"),
      ...setGridColour("blue"),
      ...setTooltip(dataset),
      ...setLegendHidden(dataset.series.length == 1),
      ...setAnnotations(),
    }));
  }, [dataset]);

  return (
    <div ref={ref} className={classes.main}>
      <div style={{ minWidth: chartWidth + "px" }}>
        <ReactApexChart
          options={options}
          series={dataset.series}
          type="area"
          height={400}
        />
      </div>
    </div>
  );
}
