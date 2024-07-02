import { Button, IconButton } from "@mui/material";
import { CSSProperties } from "react";
import classes from "./AlertChart.module.css";
import EContainer from "./EContainer";
import Header from "./Header";

function AlertCircle({
    parentWidth,
    fontWidth,
    top,
    text,
    style
}: {
    parentWidth: number;
    fontWidth?: number;
    top?: boolean;
    text: string;
    style?: CSSProperties;
}) {
    const width = parentWidth * 0.04;
    const fontSize = (fontWidth ? fontWidth : parentWidth) * 0.01;
    return (
        <>
            {top && (
                <span
                    className={classes["alert-circle-text"]}
                    style={{
                        marginBottom: parentWidth * 0.008,
                        fontSize: fontSize
                    }}
                >
                    {text}
                </span>
            )}
            <span
                className={classes["alert-circle-shape"]}
                style={{
                    width: width,
                    height: width,
                    borderRadius: width / 2,
                    ...style
                }}
            ></span>
            {!top && (
                <span
                    className={classes["alert-circle-text"]}
                    style={{
                        marginTop: parentWidth * 0.004,
                        fontSize: fontSize
                    }}
                >
                    {text}
                </span>
            )}
        </>
    );
}

function AlertCircleContainer({
    parentWidth,
    fontWidth,
    top,
    text
}: {
    parentWidth: number;
    fontWidth?: number;
    top?: boolean;
    text: string;
}) {
    return (
        <div
            className={classes["alert-circle"]}
            style={{
                padding: parentWidth * 0.01
            }}
        >
            <AlertCircle
                parentWidth={parentWidth}
                fontWidth={fontWidth ? fontWidth : parentWidth}
                top={top}
                text={text}
            />
        </div>
    );
}

export default function ({
    dataset,
    onClick,
    onEnlargeButtonClick,
    style,
    parentWidth,
    height
}: {
    dataset: any;
    onClick: () => void;
    onEnlargeButtonClick: () => void;
    style?: CSSProperties;
    parentWidth: number;
    height: number;
}) {
    return (
        <EContainer
            topRightElements={
                <IconButton
                    aria-label="enlarge"
                    onClick={() => onEnlargeButtonClick()}
                >
                    <img
                        src={
                            require("../../assets/images/icons/enlarge.svg")
                                .default
                        }
                        alt="notification"
                    />
                </IconButton>
            }
            style={{ ...style }}
        >
            <Button
                disableRipple
                className={classes["alert-chart-button"]}
                onClick={onClick}
            ></Button>
            <Header>Alert</Header>
            <div style={{ textAlign: "center" }}>
                <div style={{ display: "inline-table" }}>
                    <div
                        style={{
                            display: "table-cell",
                            verticalAlign: "middle"
                        }}
                    >
                        <AlertCircle
                            parentWidth={parentWidth}
                            fontWidth={parentWidth}
                            top={true}
                            text="PV"
                            style={{
                                background:
                                    "linear-gradient(#5ED8FF, #4D9FFF, #6D57FF)"
                            }}
                        />
                        <div style={{ display: "table" }}>
                            <AlertCircleContainer
                                parentWidth={parentWidth * 0.5}
                                fontWidth={parentWidth}
                                text="D"
                            />
                            <AlertCircleContainer
                                parentWidth={parentWidth * 0.5}
                                fontWidth={parentWidth}
                                text="W"
                            />
                            <AlertCircleContainer
                                parentWidth={parentWidth * 0.5}
                                fontWidth={parentWidth}
                                text="M"
                            />
                        </div>
                    </div>
                    <AlertCircleContainer
                        parentWidth={parentWidth}
                        text="Inverter"
                    />
                    <AlertCircleContainer parentWidth={parentWidth} text="DC" />
                    <AlertCircleContainer parentWidth={parentWidth} text="AC" />
                    <AlertCircleContainer
                        parentWidth={parentWidth}
                        text="Solar"
                    />
                    <AlertCircleContainer
                        parentWidth={parentWidth}
                        text="Temp."
                    />
                </div>
            </div>
        </EContainer>
    );
}
