// Application Constants

const APP_CONFIG = {
    APP_NAME: 'SkyTicket',
    VERSION: '1.0.0',
    API_BASE_URL: 'https://api.skyticket.com/v1',
};

const ROUTES = {
    SEARCH: 'search',
    RESULTS: 'results',
    BOOKING: 'booking',
    PAYMENT: 'payment',
    CONFIRMATION: 'confirmation',
    MY_BOOKINGS: 'my-bookings',
};

const PASSENGER_TYPES = {
    ADULT: 'adult',
    CHILD: 'child',
    INFANT: 'infant',
};

const FARE_CLASSES = {
    ECONOMY: 'economy',
    PREMIUM_ECONOMY: 'premium_economy',
    BUSINESS: 'business',
    FIRST: 'first',
};

const SEAT_STATUS = {
    AVAILABLE: 'available',
    SELECTED: 'selected',
    BOOKED: 'booked',
    UNAVAILABLE: 'unavailable',
};

const PAYMENT_METHODS = {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    PAYPAL: 'paypal',
};

const CURRENCY = 'USD';
const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';

const STORAGE_KEYS = {
    BOOKINGS: 'skyTicket_bookings',
    USER: 'skyTicket_user',
    USERS: 'skyTicket_users',
    SEARCH_HISTORY: 'skyTicket_searchHistory',
    SELECTED_FLIGHT: 'skyTicket_selectedFlight',
    BOOKING_DATA: 'skyTicket_bookingData',
    PASSENGER_COUNT: 'skyTicket_passengerCount',
};