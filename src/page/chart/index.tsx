import { Dataset } from "../../common/Types";
import DateLineChart from "./DateLineChart";
import { getDateString } from "../../common/DateUtils";
import { Button } from "@mui/material";
import { useState } from "react";
import moment from "moment";
import LineChart from "./LineChart";

function getNumberOfDays(dates: Date[]) {
    var numberOfDays = 0;
    if (dates.length > 0) {
        const startDate = dates[0];
        const endDate = dates[dates.length - 1];
        let diff = endDate.getTime() - startDate.getTime();
        numberOfDays = Math.round(diff / (1000 * 3600 * 24)) + 1;
    }
    return numberOfDays;
}

function getDatesBetweenDateStrings(
    startDateString: string,
    endDateString: string
) {
    const dates = [];
    const startDate = new Date(startDateString);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateString);
    endDate.setHours(0, 0, 0, 0);
    while (startDate <= endDate) {
        dates.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
}

function getValues(dates: Date[]) {
    const values = [];
    const numberOfDays = getNumberOfDays(dates);
    for (var i = 0; i < numberOfDays; i++) {
        values.push(Math.floor(Math.random() * 100));
    }
    return values;
}

function getDateStrings(dates: Date[]) {
    const dateStrings = [];
    if (dates.length > 0) {
        const startDate = dates[0];
        const endDate = dates[dates.length - 1];
        while (startDate <= endDate) {
            dateStrings.push(getDateString(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }
    }
    return dateStrings;
}

const getWeekNumber = (date: Date): number => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;

    // Week starts on Monday (ISO week date system)
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

const generateData = (myNumber: number, value: any) => {
    const my_list = [];
    for (var i = 0; i < myNumber; i++) {
        my_list.push(value);
    }
    return my_list;
};

function getDataset(dummy: boolean) {
    return {
        title: "Peak Efficiency",
        series: [
            {
                name: "Line 1",
                colour: "red",
                // data: getValues(
                //     getDatesBetweenDateStrings(startDateString, endDateString)
                // )
                // data: dummy ? [9, 7, 5, 3, 1] : [1, 3, 5, 7, 9]
                data: dummy ? generateData(62, 1) : generateData(62, 4)
            },
            {
                name: "Line 2",
                colour: "blue",
                // data: getValues(
                //     getDatesBetweenDateStrings(startDateString, endDateString)
                // )
                // data: dummy ? [10, 8, 6, 4, 2] : [2, 4, 6, 8, 10]
                data: dummy ? generateData(62, 4) : generateData(62, 1)
            }
        ],
        // x: getDateStrings(
        //     getDatesBetweenDateStrings(startDateString, endDateString)
        // ),
        x: dummy ? generateData(62, "A") : generateData(62, "B"),
        compareEnabled: true
    };
}

export default function () {
    const startDateString = "2024-07-01";
    const endDateString = "2024-08-31";

    const [dummy, setDummy] = useState(true);

    const dataset = getDataset(dummy);

    console.log(dataset.x);

    const numberOfPoints: number = dataset.x.length;
    var numberOfPointsToShow: number = numberOfPoints;

    // const [series, setSeries] = useState<any>(dataset);

    return (
        <>
            <div>Chart</div>
            <div style={{ height: "400px" }}>
                <LineChart
                    series={dataset.series}
                    x={dataset.x}
                    xLabelOffset={0}
                    xFormatter={(value: string) => {
                        return value;
                    }}
                    chartWidth={(width: number) => {
                        const fullWidth = 12;
                        const pointWidth = 12;
                        const scale =
                            numberOfPoints > numberOfPointsToShow
                                ? (fullWidth * numberOfPointsToShow) /
                                  numberOfPoints
                                : fullWidth;
                        return (width * pointWidth) / scale;
                    }}
                />
            </div>
            <Button
                onClick={() => {
                    setDummy(!dummy);
                }}
            >
                Click
            </Button>
        </>
    );
}
