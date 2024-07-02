import getDimension from "../../common/getDimension";
import AlertChart from "./AlertChart";

export default function () {
    const { ref, width, height } = getDimension();

    console.log(height);

    return (
        // <div ref={ref} style={{ width: "100%", backgroundColor: "green" }}>
        //     <h2>Element Size</h2>
        //     <p>Width: {width}px</p>
        //     <p>Height: {height}px</p>
        // </div>

        <div ref={ref} style={{ height: "100%", backgroundColor: "green" }}>
            <div ref={ref}>
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
            </div>
        </div>
    );
}
