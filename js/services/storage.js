// Local Storage Service
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

function saveBooking(booking) {
    const bookings = getFromStorage(STORAGE_KEYS.BOOKINGS) || [];
    bookings.push(booking);
    return saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
}

function getBookings() {
    return getFromStorage(STORAGE_KEYS.BOOKINGS) || [];
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

function getUser() {
    return getFromStorage(STORAGE_KEYS.USER);
}

function saveUser(user) {
    return saveToStorage(STORAGE_KEYS.USER, user);
}

function getSelectedFlight() {
    return getFromStorage(STORAGE_KEYS.SELECTED_FLIGHT);
}

function saveSelectedFlight(flight) {
    return saveToStorage(STORAGE_KEYS.SELECTED_FLIGHT, flight);
}

function clearSelectedFlight() {
    return removeFromStorage(STORAGE_KEYS.SELECTED_FLIGHT);
}