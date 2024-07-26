import { Dataset } from "../../common/Types";
import DateLineChart from "./DateLineChart";
import { getDateString } from "../../common/DateUtils";
import { Button } from "@mui/material";
import { useState } from "react";
import moment from "moment";

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
}


export default function () {
    const startDateString = "2024-01-01";
    const endDateString = "2025-12-31";

    const [dummy, setDummy] = useState(true);

    console.log(getDatesBetweenDateStrings(startDateString, endDateString).length);

    const dataset: Dataset = {
        title: "Peak Efficiency",
        series: [
            {
                name: "Line 1",
                colour: "red",
                // data: getValues(
                //     getDatesBetweenDateStrings(startDateString, endDateString)
                // )
                // data: dummy ? [9, 7, 5, 3, 1] : [1, 3, 5, 7, 9]
                data: generateData(731, 1)
            },
            {
                name: "Line 2",
                colour: "blue",
                // data: getValues(
                //     getDatesBetweenDateStrings(startDateString, endDateString)
                // )
                // data: dummy ? [10, 8, 6, 4, 2] : [2, 4, 6, 8, 10]
                data: generateData(731, 4)
            }
        ],
        x: getDateStrings(
                  getDatesBetweenDateStrings(startDateString, endDateString)
              ),
        // x: dummy ? ["B", "B", "B", "B", "B"] : ["A", "A", "A", "A", "A"],
        compareEnabled: true
    };

    return (
        <>
            <div>Chart</div>
            <div style={{ height: "400px" }}>
                <DateLineChart dataset={dataset} showNumberOfMonths={4} />
            </div>
        </>
    );
}
