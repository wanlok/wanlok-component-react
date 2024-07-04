import { useLoaderData } from "react-router-dom";
import getDimension from "../../common/getDimension";
import AlertChart from "./AlertChart";
import API from "../../common/API";

export default function () {
    const data = useLoaderData();
    const { ref, width, height } = getDimension();

    console.log(height);
    console.log(data);

    return (
        // <div ref={ref} style={{ width: "100%", backgroundColor: "green" }}>
        //     <h2>Element Size</h2>
        //     <p>Width: {width}px</p>
        //     <p>Height: {height}px</p>
        // </div>

        <div ref={ref} style={{ height: "100%", backgroundColor: "green" }}>
            {/* <div ref={ref}>
                <AlertChart
                    dataset={{}}
                    onClick={() => console.log("onClick")}
                    onEnlargeButtonClick={() =>
                        console.log("onEnlargeButtonClick")
                    }
                    style={{}}
                    parentWidth={width}
                    height={height * 0.4}
                />
            </div> */}
        </div>
    );
}

export function loader() {
    const jwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3YW5sb2siLCJleHAiOjE3MjAwODc1MTl9.tcEhS4lM5gEvu9nZAbXaKPzhW_dmzSkQXZNqwlay3fQ";
    return API.get_gwin(jwt);
}
