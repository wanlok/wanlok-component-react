import { Button } from "@mui/material";
import ApexChartDemo from "./ApexChartDemo";

export default function () {
  const handleExport = async () => {
    const apexCharts = ApexCharts.getChartByID("dummy");
    if (apexCharts) {
      apexCharts.exports.exportToSVG();
    }
  };

  return (
    <>
      <div>Hello World 1234</div>
      <Button variant="contained" onClick={handleExport}>
        Export Chart
      </Button>
      <ApexChartDemo id={"dummy"} />
    </>
  );
}
