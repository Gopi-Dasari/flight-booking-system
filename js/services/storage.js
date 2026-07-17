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
    const bookings = getFromStorage('skyTicket_bookings') || [];
    bookings.push(booking);
    return saveToStorage('skyTicket_bookings', bookings);
}

function getBookings() {
    return getFromStorage('skyTicket_bookings') || [];
}

function cancelBookingByPNR(pnr) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.pnr === pnr);
    if (index !== -1) {
        bookings[index].status = 'cancelled';
        return saveToStorage('skyTicket_bookings', bookings);
    }
    return false;
}

function getSelectedFlight() {
    return getFromStorage('skyTicket_selectedFlight');
}

function saveSelectedFlight(flight) {
    return saveToStorage('skyTicket_selectedFlight', flight);
}

function clearSelectedFlight() {
    return removeFromStorage('skyTicket_selectedFlight');
}

function getPassengerCount() {
    return parseInt(getFromStorage('skyTicket_passengerCount')) || 2;
}

function savePassengerCount(count) {
    return saveToStorage('skyTicket_passengerCount', count);
}

// Make globally available
window.saveToStorage = saveToStorage;
window.getFromStorage = getFromStorage;
window.removeFromStorage = removeFromStorage;
window.saveBooking = saveBooking;
window.getBookings = getBookings;
window.cancelBookingByPNR = cancelBookingByPNR;
window.getSelectedFlight = getSelectedFlight;
window.saveSelectedFlight = saveSelectedFlight;
window.clearSelectedFlight = clearSelectedFlight;
window.getPassengerCount = getPassengerCount;
window.savePassengerCount = savePassengerCount;