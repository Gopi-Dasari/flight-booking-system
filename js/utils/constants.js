const APP_CONFIG = {
    APP_NAME: 'SkyTicket',
    VERSION: '1.0.0',
};

const ROUTES = {
    SEARCH: 'search',
    RESULTS: 'results',
    BOOKING: 'booking',
    MY_BOOKINGS: 'my-bookings',
    ABOUT: 'about',
    CONTACT: 'contact',
    PRIVACY: 'privacy',
    TERMS: 'terms',
};

const STORAGE_KEYS = {
    BOOKINGS: 'skyTicket_bookings',
    SELECTED_FLIGHT: 'skyTicket_selectedFlight',
    PASSENGER_COUNT: 'skyTicket_passengerCount',
};

// Make globally available
window.STORAGE_KEYS = STORAGE_KEYS;
window.APP_CONFIG = APP_CONFIG;
window.ROUTES = ROUTES;