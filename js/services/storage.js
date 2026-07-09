// Local Storage Service

const STORAGE_KEYS = {
    BOOKINGS: 'skyTicket_bookings',
    USER: 'skyTicket_user',
    SEARCH_HISTORY: 'skyTicket_searchHistory',
    SELECTED_FLIGHT: 'skyTicket_selectedFlight',
    BOOKING_DATA: 'skyTicket_bookingData',
};

/**
 * Save data to localStorage
 */
export const saveToStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
};

/**
 * Get data from localStorage
 */
export const getFromStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
};

/**
 * Remove data from localStorage
 */
export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
};

/**
 * Clear all app data from localStorage
 */
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

/**
 * Save booking to storage
 */
export const saveBooking = (booking) => {
    const bookings = getFromStorage(STORAGE_KEYS.BOOKINGS) || [];
    bookings.push(booking);
    return saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
};

/**
 * Get all bookings
 */
export const getBookings = () => {
    return getFromStorage(STORAGE_KEYS.BOOKINGS) || [];
};

/**
 * Get booking by PNR
 */
export const getBookingByPNR = (pnr) => {
    const bookings = getBookings();
    return bookings.find(booking => booking.pnr === pnr);
};

/**
 * Save user data
 */
export const saveUser = (user) => {
    return saveToStorage(STORAGE_KEYS.USER, user);
};

/**
 * Get user data
 */
export const getUser = () => {
    return getFromStorage(STORAGE_KEYS.USER);
};

/**
 * Save selected flight
 */
export const saveSelectedFlight = (flight) => {
    return saveToStorage(STORAGE_KEYS.SELECTED_FLIGHT, flight);
};

/**
 * Get selected flight
 */
export const getSelectedFlight = () => {
    return getFromStorage(STORAGE_KEYS.SELECTED_FLIGHT);
};

/**
 * Save booking data (in-progress)
 */
export const saveBookingData = (data) => {
    return saveToStorage(STORAGE_KEYS.BOOKING_DATA, data);
};

/**
 * Get booking data (in-progress)
 */
export const getBookingData = () => {
    return getFromStorage(STORAGE_KEYS.BOOKING_DATA);
};

/**
 * Clear booking data
 */
export const clearBookingData = () => {
    return removeFromStorage(STORAGE_KEYS.BOOKING_DATA);
};

/**
 * Save search history
 */
export const saveSearchHistory = (search) => {
    let history = getFromStorage(STORAGE_KEYS.SEARCH_HISTORY) || [];
    history.unshift({
        ...search,
        timestamp: new Date().toISOString(),
    });
    // Keep only last 10 searches
    history = history.slice(0, 10);
    return saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, history);
};

/**
 * Get search history
 */
export const getSearchHistory = () => {
    return getFromStorage(STORAGE_KEYS.SEARCH_HISTORY) || [];
};