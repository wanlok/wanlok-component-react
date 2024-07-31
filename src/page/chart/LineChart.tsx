import ReactDOMServer from "react-dom/server";
import ReactApexChart, { Props as ApexChartProps } from "react-apexcharts";
import getDimension from "../../common/getDimension";
import classes from "./LineChart.module.css";
import { useEffect } from "react";

interface Series {
    series: ApexAxisChartSeries;
    dataPointIndex: number;
    w: any;
}

export const apexChartProps: ApexChartProps = {
    chart: {
        id: "Hello World",
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    grid: {
        show: true
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: "straight"
    },
    xaxis: {
        tooltip: {
            enabled: false
        },
        scrollbar: {
            enabled: true
        },
        axisTicks: {
            show: false
        },
        labels: {
            rotateAlways: true,
            rotate: 360,
            offsetY: 16,
            offsetX: 12,
            style: { fontSize: "12px" }
        }
    },
    yaxis: {
        labels: {
            rotateAlways: true,
            rotate: 360,
            offsetY: 0,
            offsetX: -4,
            style: { fontSize: "12px" }
        }
    },
    legend: {
        show: true,
        showForSingleSeries: true,
        position: "top",
        horizontalAlign: "left",
        onItemClick: {
            toggleDataSeries: false
        },
        onItemHover: {
            highlightDataSeries: false
        },
        formatter: function (seriesName: string, opts: any) {
            return opts.w.globals.seriesNames.length > 1
                ? ReactDOMServer.renderToString(Legend(seriesName, opts))
                : null;
        },
        markers: {
            width: 0,
            height: 0,
            radius: 0
        },
        itemMargin: {
            horizontal: 0
        }
    },
    colors: ["red", "green", "blue"]
};

function Tooltip(x: string[], { series, dataPointIndex, w }: Series) {
    return (
        <div>
            <div className={classes["tooltip-top"]}>{x[dataPointIndex]}</div>
            {series.map((s: any, i: number) => {
                const colour = w.config.colors[i];
                const name = w.config.series[i].name;
                const value = s[dataPointIndex];
                return (
                    <div
                        className={classes["tooltip-content"]}
                        style={{
                            paddingBottom: i == series.length - 1 ? 8 : 0 + "px"
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
                    backgroundColor: colour
                }}
            ></span>
        </>
    );
}

export function setX(
    apexChartProps: ApexChartProps,
    series: ApexAxisChartSeries,
    x: string[],
    colour: string,
    xLabelOffset: number,
    xFormatter: (value: string) => string
) {
    apexChartProps.xaxis.categories = x;
    apexChartProps.xaxis.labels.style.colors = Array.from(
        { length: x.length },
        () => colour
    );
    apexChartProps.xaxis.labels.offsetX = xLabelOffset;
    apexChartProps.xaxis.labels.formatter = xFormatter;
}

export function setYColour(apexChartProps: ApexChartProps, colour: string) {
    apexChartProps.yaxis.labels.style.colors = [colour];
}

export function setGridColour(apexChartProps: ApexChartProps, colour: string) {
    apexChartProps.grid.borderColor = colour;
}

export function setTooltip(apexChartProps: ApexChartProps, x: string[]) {
    apexChartProps.tooltip = {};
    apexChartProps.tooltip.custom = function (series: Series) {
        return ReactDOMServer.renderToString(Tooltip(x, series));
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
    options,
    series,
    chartWidth
}: {
    options: ApexCharts.ApexOptions;
    series: ApexAxisChartSeries;
    x: string[];
    xLabelOffset: number;
    xFormatter: (value: string) => string;
    chartWidth: (width: number) => number;
}) {
    const { ref, width } = getDimension();

    const chart = ApexCharts.getChartByID("Hello World");

    useEffect(() => {
        chart?.updateOptions(options, true, true, true);
    }, [options]);

    return (
        <div ref={ref} className={classes.chart}>
            <div
                style={{
                    width: chartWidth(width) + "px",
                    paddingRight: width + "px"
                }}
            >
                <ReactApexChart
                    options={options}
                    series={series}
                    type="area"
                    height="100%"
                    width="100%"
                />
            </div>
        </div>
    );
}
