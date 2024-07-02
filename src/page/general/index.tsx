import getDimension from "../../common/getDimension";

export default function () {
    const { ref, width, height } = getDimension();

    return (
        <div ref={ref} style={{ width: "100%", backgroundColor: "green" }}>
            <h2>Element Size</h2>
            <p>Width: {width}px</p>
            <p>Height: {height}px</p>
        </div>
    );
}
