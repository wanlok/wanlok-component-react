import { Button } from "@mui/material";
import { toPng } from "html-to-image";
import { createRoot } from "react-dom/client";
import { RechartsChart } from "./RechartsChart";

export const DummyChart2 = () => {
  const handleExport = async () => {
    // Create and append temp container
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "fixed";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "0px";
    tempContainer.style.width = "600px";
    tempContainer.style.height = "400px";
    tempContainer.style.backgroundColor = "#fff";
    document.body.appendChild(tempContainer);

    // Render chart into container
    const root = createRoot(tempContainer);
    root.render(<RechartsChart />);

    // Wait for chart to render — use requestAnimationFrame for layout cycle
    requestAnimationFrame(() => {
      setTimeout(async () => {
        try {
          const dataUrl = await toPng(tempContainer);
          const link = document.createElement("a");
          link.download = "chart.png";
          link.href = dataUrl;
          link.click();
        } catch (err) {
          console.error("Export failed", err);
        } finally {
          root.unmount();
          document.body.removeChild(tempContainer);
        }
      }, 200); // Delay may need tuning
    });
  };

  return (
    <>
      <div>Hello World 1234</div>
      <Button variant="contained" onClick={handleExport}>
        Export Chart
      </Button>
    </>
  );
};
