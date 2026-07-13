// Local Storage Service

const STORAGE_KEYS = {
    BOOKINGS: 'skyTicket_bookings',
    USER: 'skyTicket_user',
    USERS: 'skyTicket_users',
    SEARCH_HISTORY: 'skyTicket_searchHistory',
    SELECTED_FLIGHT: 'skyTicket_selectedFlight',
    BOOKING_DATA: 'skyTicket_bookingData',
    PASSENGER_COUNT: 'skyTicket_passengerCount',
};

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

function clearStorage() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

// Bookings
function saveBooking(booking) {
    const bookings = getFromStorage(STORAGE_KEYS.BOOKINGS) || [];
    bookings.push(booking);
    return saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
}

function getBookings() {
    return getFromStorage(STORAGE_KEYS.BOOKINGS) || [];
}

function getBookingByPNR(pnr) {
    const bookings = getBookings();
    return bookings.find(booking => booking.pnr === pnr);
}

function cancelBookingByPNR(pnr) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.pnr === pnr);
    if (index !== -1) {
        bookings[index].status = 'cancelled';
        return saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    }
    return false;
}

// Users
function saveUser(user) {
    return saveToStorage(STORAGE_KEYS.USER, user);
}

function getUser() {
    return getFromStorage(STORAGE_KEYS.USER);
}

function getUsers() {
    return getFromStorage(STORAGE_KEYS.USERS) || [];
}

function saveUsers(users) {
    return saveToStorage(STORAGE_KEYS.USERS, users);
}

function findUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email === email);
}

// Selected Flight
function saveSelectedFlight(flight) {
    return saveToStorage(STORAGE_KEYS.SELECTED_FLIGHT, flight);
}

function getSelectedFlight() {
    return getFromStorage(STORAGE_KEYS.SELECTED_FLIGHT);
}

function clearSelectedFlight() {
    return removeFromStorage(STORAGE_KEYS.SELECTED_FLIGHT);
}

// Passenger Count
function savePassengerCount(count) {
    return saveToStorage(STORAGE_KEYS.PASSENGER_COUNT, count);
}

function getPassengerCount() {
    return parseInt(getFromStorage(STORAGE_KEYS.PASSENGER_COUNT)) || 2;
}

// Search History
function saveSearchHistory(search) {
    let history = getFromStorage(STORAGE_KEYS.SEARCH_HISTORY) || [];
    history.unshift({
        ...search,
        timestamp: new Date().toISOString(),
    });
    history = history.slice(0, 10);
    return saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, history);
}

function getSearchHistory() {
    return getFromStorage(STORAGE_KEYS.SEARCH_HISTORY) || [];
}