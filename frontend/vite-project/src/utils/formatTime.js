import { parse, format } from "date-fns";

const formatDateForDetail = (date) => {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
      
    const returnDate = new Date(date).toLocaleDateString("vi-VN", options);
    return returnDate;
};

const formatDateForInput = (date) => {
    let dateFormatted = date;
    if (!date || date.length === 0) {
        dateFormatted = new Date().toDateString();
    }
    return format(dateFormatted, "yyyy-MM-dd");
}

export {formatDateForInput, formatDateForDetail};