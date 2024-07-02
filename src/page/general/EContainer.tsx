import { Button } from "@mui/material";
import React, { CSSProperties, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
    href?: string;
    onClick?: (e: any) => void;
    onMouseEnter?: (e: any) => void;
    onMouseOut?: (e: any) => void;
    topRightElements?: React.ReactNode;
    showAnimatedShadow?: boolean;
    style?: CSSProperties;
    children: React.ReactNode;
}

function EContainer({
    href,
    onClick,
    onMouseEnter,
    onMouseOut,
    topRightElements,
    showAnimatedShadow,
    style,
    children
}: Props) {
    var button = <></>;
    const buttonStyle: CSSProperties = {
        borderRadius: 16,
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    };
    if (onClick) {
        button = (
            <Button
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseOut={onMouseOut}
                style={buttonStyle}
            ></Button>
        );
    }
    if (href) {
        button = (
            <Link to={href}>
                {onClick ? (
                    button
                ) : (
                    <Button
                        onMouseEnter={onMouseEnter}
                        onMouseOut={onMouseOut}
                        style={buttonStyle}
                    ></Button>
                )}
            </Link>
        );
    }
    var elements = <></>;
    if (topRightElements) {
        elements = (
            <div
                style={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
            >
                {topRightElements}
            </div>
        );
    }
    const [opacity, setOpacity] = useState(0);
    var i = 0;
    var increasing = true;
    useEffect(() => {
        const timer = setInterval(() => {
            setOpacity(i);
            if (i == 100) {
                increasing = false;
            }
            if (i == 0) {
                increasing = true;
            }
            i = increasing ? i + 10 : i - 10;
        }, 200);
        return () => clearInterval(timer);
    }, []);
    var s = {};
    if (showAnimatedShadow) {
        s = {
            background: "#1A1E39CC",
            border: "#00F0FF solid 1px",
            borderRadius: 16,
            padding: 20,
            color: "white",
            position: "relative",
            boxShadow: `0px 0px 16px rgba(255, 51, 125, ${opacity / 100})`,
            ...style
        };
    } else {
        s = {
            background: "#1A1E39CC",
            border: "#00F0FF solid 1px",
            borderRadius: 16,
            padding: 20,
            color: "white",
            position: "relative",
            ...style
        };
    }
    return (
        <div style={s}>
            {elements}
            {children}
            {button}
        </div>
    );
}

export default EContainer;
