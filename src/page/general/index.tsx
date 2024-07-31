import { useLoaderData } from "react-router-dom";
import getDimension from "../../common/getDimension";
import AlertChart from "./AlertChart";
import API from "../../common/API";
import { StringMappingType } from "typescript";
import styled from "styled-components";

const callAPI = async () => {
    // const deviceIds = [1, 2, 3];
    // const statusDict = await getDevicesOnlineStatus(deviceIds);
    // console.log(statusDict.length);
    // console.log(statusDict);
    // for (var i = 0; i < deviceIds.length; i++) {
    //     console.log(statusDict[deviceIds[i]]);
    // }
};

const Title = styled.div`
  font-size: 1.5em;
  text-align: center;
  color: #BF4F74;
  background-color: blue;
`;

// The Button from the last section without the interpolations
const Button = styled.button`
  color: #BF4F74;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #BF4F74;
  border-radius: 3px;
`;

// A new component based on Button, but with some override styles
const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;



export default function () {
    // const data = useLoaderData();
    const { ref, width, height } = getDimension();

    console.log(height);
    // console.log(data);

    return (
        // <div ref={ref} style={{ width: "100%", backgroundColor: "green" }}>
        //     <h2>Element Size</h2>
        //     <p>Width: {width}px</p>
        //     <p>Height: {height}px</p>
        // </div>

        <div
            ref={ref}
            style={{
                height: "100%",
                backgroundColor: "green",
                position: "relative"
            }}
        >
            <Title>Hello World</Title>
            <Button onClick={callAPI}>Click</Button>
        </div>
    );
}

export function loader() {
    // const jwt =
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3YW5sb2siLCJleHAiOjE3MjAwODc1MTl9.tcEhS4lM5gEvu9nZAbXaKPzhW_dmzSkQXZNqwlay3fQ";
    // return API.get_gwin(jwt);
    return "";
}
