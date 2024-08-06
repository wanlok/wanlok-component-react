import { useLoaderData } from "react-router-dom";
import getDimension from "../../common/getDimension";
import AlertChart from "./AlertChart";
import API from "../../common/API";
import { StringMappingType } from "typescript";
import styled from "styled-components";
import { Button } from "@mui/material";

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
            {/* <Button onClick={callAPI}>Click</Button> */}

            <Button
                sx={{
                    background:
                        "linear-gradient(to right, #b94ef7 0%, #0cb2ff 20%, orange 50%, yellow 100%);",
                    backgroundPosition: "0% 100%",
                    backgroundSize: "500%",
                    color: "white",
                    "&:hover": {
                        backgroundPosition: "100% 100%",
                        boxShadow: "0px 3px 20px 1px yellow",
                        color: "black"
                    },
                    transition: "all 2s ease"
                }}
            >
                Hover Me
            </Button>
        </div>
    );
}

export function loader() {
    // const jwt =
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3YW5sb2siLCJleHAiOjE3MjAwODc1MTl9.tcEhS4lM5gEvu9nZAbXaKPzhW_dmzSkQXZNqwlay3fQ";
    // return API.get_gwin(jwt);
    return "";
}
