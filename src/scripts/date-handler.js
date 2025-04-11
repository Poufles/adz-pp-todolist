import { format, parse, differenceInMilliseconds, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";

const DateHandler = function() {
    /**
     * Retrieves current time
     * @returns A formatted date (MM/dd/yyyy)
     */
    const currentDate = () => {
        const now = new Date();
        const formattedDate = format(now, 'MM/dd/yyyy');

        return formattedDate;
    };

    /**
     * Retrieves current time
     * @returns A formatted time (hh:mma)
     */
    const currentTime = () => {
        const now = new Date();
        const formattedTime = format(now, 'hh:mma');

        return formattedTime;
    };

    /**
     * Identifies the difference between two time periods.
     * @param {String} dateInput - Date of todos/projects
     * @returns An object containing the difference in days, hours, minutes, or milliseconds.
     */
    const timeDifference = (dateInput) => {
        const now = new Date();
        const [hour, date] = dateInput.split(' @ ');
        const formattedDate = parse(`${date} ${hour}`, 'MM/dd/yyyy hh:mma', new Date());

        const daysDifference = differenceInDays(formattedDate, now);
        const hoursDifference = differenceInHours(formattedDate, now);
        const minutesDifference = differenceInMinutes(formattedDate, now);
        const millisecDifference = differenceInMilliseconds(formattedDate, now);

        return {
            daysDifference,
            hoursDifference,
            minutesDifference,
            millisecDifference
        };
    };

    return {
        currentDate,
        currentTime,
        timeDifference
    };
}();

export default DateHandler;