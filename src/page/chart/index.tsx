import { Dataset } from "../../common/Types";
import DateLineChart from "./DateLineChart";
import { getDateString } from "../../common/DateUtils";

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

export default function () {
    const startDateString = "2024-01-01";
    const endDateString = "2025-12-31";

    const dataset: Dataset = {
        title: "Peak Efficiency",
        series: [
            {
                colour: "red",
                data: getValues(
                    getDatesBetweenDateStrings(startDateString, endDateString)
                )
            },
            {
                name: "Line 2",
                colour: "blue",
                data: getValues(
                    getDatesBetweenDateStrings(startDateString, endDateString)
                )
            }
        ],
        x: getDateStrings(
            getDatesBetweenDateStrings(startDateString, endDateString)
        ),
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
