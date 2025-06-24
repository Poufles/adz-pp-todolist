import { format } from "date-fns";

const DateHandler = function() {
    const getDateToday = () => {
        const today = new Date();
        const formatted = format(today, 'MM/dd/yyyy');

        return formatted
    };

    return {
        getDateToday
    }
}();

export default DateHandler;