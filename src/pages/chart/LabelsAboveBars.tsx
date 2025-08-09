import React from "react";
import { useAnimate } from "@mui/x-charts/hooks";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { BarLabelProps, BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { styled } from "@mui/material/styles";
import { interpolateObject } from "@mui/x-charts-vendor/d3-interpolate";

const data = [5, 17, 11];

export const LabelsAboveBars = () => {
  return (
    <ChartContainer
      xAxis={[{ scaleType: "band", data: ["A", "B", "C"] }]}
      series={[{ type: "bar", id: "base", data }]}
      height={400}
      yAxis={[{ width: 30 }]}
      margin={{ left: 0, right: 10 }}
      sx={{ flex: 0.5 }}
    >
      <BarPlot barLabel="value" slots={{ barLabel: BarLabel }} />
      <ChartsXAxis />
      <ChartsYAxis />
    </ChartContainer>
  );
};

const Text = styled("text")(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: "none",
  // fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: "opacity 0.2s ease-in, fill 0.2s ease-in",
  textAnchor: "middle",
  dominantBaseline: "central",
  pointerEvents: "none"
}));

function BarLabel(props: BarLabelProps) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  const animatedProps = useAnimate(
    { x: x + width / 2, y },
    {
      initialProps: { x: x + width / 2, y: yOrigin },
      createInterpolator: interpolateObject,
      transformProps: (p) => p,
      applyProps: (element: SVGGElement, p) => {
        element.setAttribute("transform", `translate(${p.x}, ${p.y})`);
      },
      skip: skipAnimation
    }
  );

  // Estimate text dimensions for the background rectangle
  const textValue = String(data[dataIndex]);
  const textLabel = "Test label above bar";
  const padding = 4; // Padding around text
  const fontSize = 12; // Approximate font size for calculation
  const lineHeight = 1.2; // Approximate line height

  // Rough estimation of text width based on character count
  const estimatedTextWidth = Math.max(textValue.length, textLabel.length) * (fontSize * 0.6) + padding * 2;
  const estimatedTextHeight = fontSize * lineHeight * 2 + padding * 2; // Two lines of text

  // const estimatedTextWidth = 200;
  // const estimatedTextHeight = 40;

  // Position the rect relative to the group's origin (0,0)

  const offset = -24;

  const rectX = -estimatedTextWidth / 2;
  const rectY = -estimatedTextHeight / 2 + offset;

  return (
    <g {...otherProps} {...animatedProps}>
      {/* Background rectangle */}
      <rect
        x={rectX}
        y={rectY}
        width={estimatedTextWidth}
        height={estimatedTextHeight}
        fill="red"
        rx={4} // Rounded corners
        ry={4}
      />
      {/* First text element (value) */}
      <Text
        x={0} // Centered horizontally relative to group
        y={(-fontSize * lineHeight) / 2 + offset} // Positioned above the center
        fill="white"
        textAnchor="middle"
      >
        {textValue}
      </Text>
      {/* Second text element (label) */}
      <Text
        x={0} // Centered horizontally relative to group
        y={(fontSize * lineHeight) / 2 + offset} // Positioned below the center
        fill="white"
        textAnchor="middle"
      >
        {textLabel}
      </Text>
    </g>
  );
}
