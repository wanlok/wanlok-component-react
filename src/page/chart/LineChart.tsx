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

const apexChartProps: ApexChartProps = {
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
    labels: {
      rotateAlways: true,
      rotate: 360,
      offsetY: 16,
      offsetX: 12,
      style: { fontSize: "12px" },
    },
  },
  yaxis: {
    labels: {
      rotateAlways: true,
      rotate: 360,
      offsetY: 0,
      offsetX: -4,
      style: { fontSize: "12px" },
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
  props: any,
  dataset: Dataset,
  colour: string,
  formatter: (value: string) => string
) {
  props.xaxis.categories = dataset.x;
  props.xaxis.labels.style.colors = Array.from(
    { length: dataset.x.length },
    () => colour
  );
  props.colors = dataset.series.map((series) => series.colour);
  props.xaxis.labels.formatter = formatter;
}

function setYColour(props: any, colour: string) {
  props.yaxis.labels.style.colors = [colour];
}

function setGridColour(props: any, colour: string) {
  props.grid.borderColor = colour;
}

function setLegendHidden(props: any, hidden: boolean) {
  if (hidden) {
    props.legend.formatter = function () {
      return null;
    };
  }
}

function setTooltip(props: any, dataset: Dataset) {
  props.tooltip = {};
  props.tooltip.custom = function (series: Series) {
    return ReactDOMServer.renderToString(Tooltip(dataset, series));
  };
}

function addHorizontalLine() {
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

export default function ({
  dataset,
  xFormatter,
  chartWidth,
}: {
  dataset: Dataset;
  xFormatter: (value: string) => string;
  chartWidth: (width: number) => number;
}) {
  const { ref, width } = getDimension();

  setX(apexChartProps, dataset, "black", xFormatter);
  setYColour(apexChartProps, "black");
  setGridColour(apexChartProps, "blue");
  setTooltip(apexChartProps, dataset);
  setLegendHidden(apexChartProps, dataset.series.length == 1);

  return (
    <div ref={ref} className={classes.chart}>
      <div style={{ width: chartWidth(width) + "px" }}>
        <ReactApexChart
          options={apexChartProps}
          series={dataset.series}
          type="area"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}
