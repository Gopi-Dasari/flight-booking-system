// Date Utilities

/**
 * Adds days to a date
 */
export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

/**
 * Subtracts days from a date
 */
export const subtractDays = (date, days) => {
    return addDays(date, -days);
};

/**
 * Checks if two dates are the same day
 */
export const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};

/**
 * Returns day difference between two dates
 */
export const getDaysDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Returns today's date in YYYY-MM-DD format
 */
export const getToday = () => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Checks if a date is in the past
 */
export const isPastDate = (date) => {
    return new Date(date) < new Date();
};

/**
 * Checks if a date is in the future
 */
export const isFutureDate = (date) => {
    return new Date(date) > new Date();
};

/**
 * Parses a date string to Date object
 */
export const parseDate = (dateStr) => {
    return new Date(dateStr);
};

/**
 * Gets the day of the week
 */
export const getDayOfWeek = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
};

/**
 * Gets month name
 */
export const getMonthName = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[new Date(date).getMonth()];
};