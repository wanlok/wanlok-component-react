import { useLoaderData } from "react-router-dom";
import getDimension from "../../common/getDimension";
import AlertChart from "./AlertChart";
import API from "../../common/API";
import { StringMappingType } from "typescript";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useRef } from "react";

const callAPI = async () => {
    // const deviceIds = [1, 2, 3];
    // const statusDict = await getDevicesOnlineStatus(deviceIds);
    // console.log(statusDict.length);
    // console.log(statusDict);
    // for (var i = 0; i < deviceIds.length; i++) {
    //     console.log(statusDict[deviceIds[i]]);
    // }
};

// const Title = styled.div`
//     font-size: 1.5em;
//     text-align: center;
//     color: #bf4f74;
//     background-color: blue;
// `;

// // The Button from the last section without the interpolations
// const Button = styled.button`
//     color: #bf4f74;
//     font-size: 1em;
//     margin: 1em;
//     padding: 0.25em 1em;
//     border: 2px solid #bf4f74;
//     border-radius: 3px;
// `;

// // A new component based on Button, but with some override styles
// const TomatoButton = styled(Button)`
//     color: tomato;
//     border-color: tomato;
// `;

export default function () {
    // const data = useLoaderData();

    return (
        <div style={{ padding: 16 + "px" }}>
            <div style={{ backgroundColor: "blue" }}>
                <Button
                    onClick={() => {
                        const small = document.getElementById("small");
                        const big = document.getElementById("big");
                        if (small && big) {
                            big.style.opacity = "0";
                            small.style.opacity = "1";
                        }
                    }}
                >
                    Minimise
                </Button>
                <Button
                    onClick={() => {
                        const small = document.getElementById("small");
                        const big = document.getElementById("big");
                        if (small && big) {
                            small.style.opacity = "0";
                            big.style.opacity = "1";
                        }
                    }}
                >
                    Maximise
                </Button>
            </div>
            <div
                id="small"
                style={{
                    width: "200px",
                    height: "200px",
                    backgroundColor: "green",
                    position: "absolute",
                    top: "200px",
                    left: "400px",
                    opacity: "1",
                    transition: "opacity 0.5s ease"
                }}
            >
                A
            </div>
            <div
                id="big"
                style={{
                    width: "400px",
                    height: "400px",
                    backgroundColor: "red",
                    position: "absolute",
                    top: "100px",
                    left: "800px",
                    opacity: "0",
                    transition: "opacity 0.5s ease"
                }}
            >
                B
            </div>
        </div>
    );
}

export function loader() {
    // const jwt =
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3YW5sb2siLCJleHAiOjE3MjAwODc1MTl9.tcEhS4lM5gEvu9nZAbXaKPzhW_dmzSkQXZNqwlay3fQ";
    // return API.get_gwin(jwt);
    return "";
}
