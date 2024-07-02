import { Button, IconButton } from "@mui/material";
import { CSSProperties } from "react";
import classes from "./AlertChart.module.css";
import EContainer from "./EContainer";
import Header from "./Header";

function AlertCircle({
    height,
    height2,
    top,
    text,
    style
}: {
    height: number;
    height2?: number;
    top?: boolean;
    text: string;
    style?: CSSProperties;
}) {
    const width = height * 0.28;
    const fontSize = height2 ? height2 * 0.14 : height * 0.14;
    return (
        <>
            {top && (
                <span
                    className={classes["alert-circle-text"]}
                    style={{
                        fontSize: fontSize + "px"
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
                        fontSize: fontSize + "px"
                    }}
                >
                    {text}
                </span>
            )}
        </>
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
            <div
                style={{
                    textAlign: "center",
                    height: height,
                    backgroundColor: "blue"
                }}
            >
                <div
                    style={{
                        display: "inline-table",
                        height: "inherit",
                        backgroundColor: "red"
                    }}
                >
                    <div
                        style={{
                            display: "table-cell",
                            width: "16.5%",
                            verticalAlign: "middle"
                        }}
                    >
                        <AlertCircle
                            height={height}
                            top={true}
                            text="PV"
                            style={{
                                background:
                                    "linear-gradient(#5ED8FF, #4D9FFF, #6D57FF)"
                            }}
                        />
                        <div style={{ display: "table" }}>
                            <div
                                style={{
                                    display: "table-cell",
                                    width: "16.5%",
                                    verticalAlign: "middle"
                                }}
                            >
                                <AlertCircle
                                    height={height * 0.5}
                                    height2={height}
                                    text="D"
                                />
                            </div>
                            <div
                                style={{
                                    display: "table-cell",
                                    width: "16.5%",
                                    verticalAlign: "middle"
                                }}
                            >
                                <AlertCircle
                                    height={height * 0.5}
                                    height2={height}
                                    text="W"
                                />
                            </div>
                            <div
                                style={{
                                    display: "table-cell",
                                    width: "16.5%",
                                    verticalAlign: "middle"
                                }}
                            >
                                <AlertCircle
                                    height={height * 0.5}
                                    height2={height}
                                    text="M"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "table-cell",
                            width: "16.5%",
                            verticalAlign: "middle"
                        }}
                    >
                        <AlertCircle
                            height={height}
                            text="Inventer"
                        />
                    </div>
                    <div
                        style={{
                            display: "table-cell",
                            width: "16.5%",
                            verticalAlign: "middle"
                        }}
                    >
                        <AlertCircle
                            height={height}
                            text="DC"
                        />
                    </div>
                    <div
                        style={{
                            display: "table-cell",
                            width: "16.5%",
                            verticalAlign: "middle"
                        }}
                    >
                        <AlertCircle
                            height={height}
                            text="AC"
                        />
                    </div>
                    <div
                        style={{
                            display: "table-cell",
                            width: "16.5%",
                            verticalAlign: "middle"
                        }}
                    >
                        <AlertCircle
                            height={height}
                            text="Solar"
                        />
                    </div>
                    <div
                        style={{
                            display: "table-cell",
                            width: "16.5%",
                            verticalAlign: "middle"
                        }}
                    >
                        <AlertCircle
                            height={height}
                            text="Temp."
                        />
                    </div>
                </div>
            </div>
        </EContainer>
    );
}
