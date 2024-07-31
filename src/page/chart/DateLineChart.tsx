import { Dataset } from "../../common/Types";
import LineChart from "./LineChart";

const pointWidth = 12;
const fullWidth = 12;

function getMonthSet(x: string[]) {
    const monthSet: Set<string> = new Set();
    for (var i = 0; i < x.length; i++) {
        const slices = x[i].split(" ");
        monthSet.add(slices[1] + " " + slices[2]);
    }
    return monthSet;
}

export default function ({
    dataset,
    showNumberOfPoints
}: {
    dataset: Dataset;
    showNumberOfPoints: number;
}) {

    


    // const firstDateString = dataset.x.length > 0 ? dataset.x[0] : "";
    const scale =
        dataset.x.length > showNumberOfPoints
            ? (fullWidth * showNumberOfPoints) / dataset.x.length
            : fullWidth;
    return (
        // <LineChart
        //     series={dataset.series}
        //     x={dataset.x}
        //     xLabelOffset={1.6}
        //     xFormatter={function (value: string) {
        //         var label = "";
        //         if (value != null) {
        //             const slices = value.split(" ");
        //             // label =
        //             //     value == firstDateString || slices[0] == "1"
        //             //         ? slices[1] + " " + slices[2]
        //             //         : "";

        //             if (parseInt(slices[0]) % 2 === 0) {
        //                 label = slices[0];
        //             }
        //         }

        //         return label;
        //     }}
        //     chartWidth={function (width: number) {
        //         return (width * pointWidth) / scale;
        //     }}
        // />
        <></>
    );
}
