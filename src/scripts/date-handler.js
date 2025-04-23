import { format, parse, isBefore, isValid, isToday, differenceInMilliseconds, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";

// import { format, parse, differenceInMilliseconds, differenceInMinutes, differenceInHours, differenceInDays } from "https://esm.sh/date-fns";

const DateHandler = function () {
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
     * Verifies if the time is valid.
     * @param {string} time - The time string to be validated.
     * @returns A boolean value
     */
    const isValidateFullTime = (time) => {
        const [hour, date] = time.split(' @ ');
        const formattedDate = parse(`${date} ${hour}`, 'MM/dd/yyyy hh:mma', new Date());

        if (!isValid(formattedDate)) return false;

        return !isBefore(formattedDate, new Date());
    };

    /**
     * Retrieves the given time type from a formatted time.
     * @param {string} formattedTime - Time with a format of hh:mma @ MM/dd/yyyy 
     * @param {string} type - hour || date 
     */
    const getTimeSlice = (formattedTime, type) => {
        const [hour, date] = formattedTime.split(' @ ');
        
        if (type === 'hour') return hour;
        if (type === 'date') return date;
    };

    /**
     * Time to be added to a certain time type (hour || minute).
     * @param {string} type -  
     * @param {number} addedTime 
     */
    const addTime = (type, addedTime) => {

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

        const isThisTimeToday = isToday(parse(date, 'MM/dd/yyyy', new Date()));
        const daysDifference = differenceInDays(formattedDate, now);
        const hoursDifference = differenceInHours(formattedDate, now);
        const minutesDifference = differenceInMinutes(formattedDate, now);
        const millisecDifference = differenceInMilliseconds(formattedDate, now);

        return {
            isThisTimeToday,
            daysDifference,
            hoursDifference,
            minutesDifference,
            millisecDifference
        };
    };

    return {
        currentDate,
        currentTime,
        getTimeSlice,
        isValidateFullTime,
        timeDifference
    };
}();

export default DateHandler;