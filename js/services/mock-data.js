import { generateId } from '../utils/helpers.js';

const airlines = [
    { name: 'Emirates', code: 'EK', logo: '✈️' },
    { name: 'Delta', code: 'DL', logo: '✈️' },
    { name: 'American Airlines', code: 'AA', logo: '✈️' },
    { name: 'United', code: 'UA', logo: '✈️' },
    { name: 'British Airways', code: 'BA', logo: '✈️' },
    { name: 'Air India', code: 'AI', logo: '✈️' },
    { name: 'Singapore Airlines', code: 'SQ', logo: '✈️' },
    { name: 'Lufthansa', code: 'LH', logo: '✈️' },
];

const airports = [
    { code: 'NYC', city: 'New York', country: 'USA' },
    { code: 'LON', city: 'London', country: 'UK' },
    { code: 'PAR', city: 'Paris', country: 'France' },
    { code: 'TYO', city: 'Tokyo', country: 'Japan' },
    { code: 'DXB', city: 'Dubai', country: 'UAE' },
    { code: 'SIN', city: 'Singapore', country: 'Singapore' },
    { code: 'LAX', city: 'Los Angeles', country: 'USA' },
    { code: 'CHI', city: 'Chicago', country: 'USA' },
    { code: 'MIA', city: 'Miami', country: 'USA' },
    { code: 'FRA', city: 'Frankfurt', country: 'Germany' },
];

const generateFlight = (from, to, date) => {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const departureHour = Math.floor(Math.random() * 24);
    const departureMinute = Math.floor(Math.random() * 60);
    const duration = Math.floor(Math.random() * 480) + 120;
    const stops = Math.random() > 0.7 ? 1 : 0;
    
    const departureTime = `${String(departureHour).padStart(2, '0')}:${String(departureMinute).padStart(2, '0')}`;
    const arrivalHour = (departureHour + Math.floor(duration / 60)) % 24;
    const arrivalMinute = (departureMinute + duration % 60) % 60;
    const arrivalTime = `${String(arrivalHour).padStart(2, '0')}:${String(arrivalMinute).padStart(2, '0')}`;
    
    const basePrice = Math.floor(Math.random() * 400) + 150;
    const price = basePrice + (stops === 0 ? 100 : 0);
    
    return {
        id: generateId(),
        airline: airline,
        flightNumber: `${airline.code}${Math.floor(Math.random() * 900 + 100)}`,
        from: from,
        to: to,
        departureDate: date,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        duration: duration,
        stops: stops,
        price: price,
        currency: 'USD',
        seatsAvailable: Math.floor(Math.random() * 50) + 10,
    };
};

export const searchFlights = (from, to, date) => {
    const flights = [];
    const numFlights = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i < numFlights; i++) {
        flights.push(generateFlight(from, to, date));
    }
    
    flights.sort((a, b) => a.price - b.price);
    return flights;
};

export const getPopularRoutes = () => {
    return [
        { from: 'New York', to: 'London' },
        { from: 'Los Angeles', to: 'Tokyo' },
        { from: 'Chicago', to: 'Paris' },
        { from: 'Miami', to: 'Dubai' },
    ];
};

export const getAirports = () => {
    return airports;
};

export const getAirlines = () => {
    return airlines;
};

export const generateSeatMap = () => {
    const rows = 10;
    const cols = 6;
    const seats = [];
    const statuses = ['available', 'available', 'available', 'booked', 'unavailable'];
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            seats.push({
                id: `${String.fromCharCode(65 + row)}${col + 1}`,
                row: String.fromCharCode(65 + row),
                col: col + 1,
                status: status,
                price: status === 'available' ? Math.floor(Math.random() * 50) + 20 : null,
            });
        }
    }
    
    return seats;
};