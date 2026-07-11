import { STORAGE_KEYS } from '../utils/constants.js';

export const saveToStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
};

export const getFromStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
};

export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
};

export const clearStorage = () => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
};

export const saveBooking = (booking) => {
    const bookings = getFromStorage(STORAGE_KEYS.BOOKINGS) || [];
    bookings.push(booking);
    return saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
};

export const getBookings = () => {
    return getFromStorage(STORAGE_KEYS.BOOKINGS) || [];
};

export const getBookingByPNR = (pnr) => {
    const bookings = getBookings();
    return bookings.find(booking => booking.pnr === pnr);
};

export const cancelBooking = (pnr) => {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.pnr === pnr);
    if (index !== -1) {
        bookings[index].status = 'cancelled';
        return saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    }
    return false;
};

export const saveUser = (user) => {
    return saveToStorage(STORAGE_KEYS.USER, user);
};

export const getUser = () => {
    return getFromStorage(STORAGE_KEYS.USER);
};

export const saveSelectedFlight = (flight) => {
    return saveToStorage(STORAGE_KEYS.SELECTED_FLIGHT, flight);
};

export const getSelectedFlight = () => {
    return getFromStorage(STORAGE_KEYS.SELECTED_FLIGHT);
};

export const clearSelectedFlight = () => {
    return removeFromStorage(STORAGE_KEYS.SELECTED_FLIGHT);
};

export const saveBookingData = (data) => {
    return saveToStorage(STORAGE_KEYS.BOOKING_DATA, data);
};

export const getBookingData = () => {
    return getFromStorage(STORAGE_KEYS.BOOKING_DATA);
};

export const clearBookingData = () => {
    return removeFromStorage(STORAGE_KEYS.BOOKING_DATA);
};

export const saveSearchHistory = (search) => {
    let history = getFromStorage(STORAGE_KEYS.SEARCH_HISTORY) || [];
    history.unshift({
        ...search,
        timestamp: new Date().toISOString(),
    });
    history = history.slice(0, 10);
    return saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, history);
};

export const getSearchHistory = () => {
    return getFromStorage(STORAGE_KEYS.SEARCH_HISTORY) || [];
};

export const getUsers = () => {
    return getFromStorage(STORAGE_KEYS.USERS) || [];
};

export const saveUsers = (users) => {
    return saveToStorage(STORAGE_KEYS.USERS, users);
};

export const findUserByEmail = (email) => {
    const users = getUsers();
    return users.find(u => u.email === email);
};