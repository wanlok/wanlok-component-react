import ReactApexChart, { Props } from "react-apexcharts";
import ReactDOMServer from "react-dom/server";

const getOptions = (id: string, animated: boolean): Props => {
  return {
    chart: {
      id,
      animations: {
        enabled: animated
      },
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
        return opts.w.globals.seriesNames.length > 1 ? ReactDOMServer.renderToString(Legend(seriesName, opts)) : null;
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
};

const Legend = (seriesName: string, opts: any) => {
  const colour = opts.w.globals.colors[opts.seriesIndex];
  return (
    <>
      {seriesName}
      <span
        style={{
          backgroundColor: colour,
          display: "inline-block",
          width: 24,
          height: 4,
          marginTop: -4,
          marginLeft: 12,
          marginRight: 8,
          verticalAlign: "middle"
        }}
      ></span>
    </>
  );
};

interface ApexChartDummyChartProps {
  id: string;
  animated: boolean;
}

const ApexChartDummyChart = ({ id, animated }: ApexChartDummyChartProps) => {
  const options = getOptions(id, animated);
  const series: ApexAxisChartSeries = [
    {
      name: "Line 1",
      data: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    },
    {
      name: "Line 2",
      data: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
    }
  ];
  return <ReactApexChart options={options} series={series} type="area" height="1080" width="1920" />;
};

export default ApexChartDummyChart;
