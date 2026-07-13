// Mock Flight Data with All Cities

const cities = [
    // India
    { name: 'Hyderabad', code: 'HYD', country: 'India' },
    { name: 'Mumbai', code: 'BOM', country: 'India' },
    { name: 'Delhi', code: 'DEL', country: 'India' },
    { name: 'Bangalore', code: 'BLR', country: 'India' },
    { name: 'Chennai', code: 'MAA', country: 'India' },
    { name: 'Kolkata', code: 'CCU', country: 'India' },
    { name: 'Pune', code: 'PNQ', country: 'India' },
    { name: 'Ahmedabad', code: 'AMD', country: 'India' },
    { name: 'Goa', code: 'GOI', country: 'India' },
    { name: 'Jaipur', code: 'JAI', country: 'India' },
    { name: 'Lucknow', code: 'LKO', country: 'India' },
    { name: 'Nagpur', code: 'NAG', country: 'India' },
    { name: 'Indore', code: 'IDR', country: 'India' },
    { name: 'Bhopal', code: 'BHO', country: 'India' },
    { name: 'Varanasi', code: 'VNS', country: 'India' },
    
    // USA
    { name: 'New York', code: 'NYC', country: 'USA' },
    { name: 'Los Angeles', code: 'LAX', country: 'USA' },
    { name: 'Chicago', code: 'CHI', country: 'USA' },
    { name: 'Miami', code: 'MIA', country: 'USA' },
    { name: 'San Francisco', code: 'SFO', country: 'USA' },
    { name: 'Boston', code: 'BOS', country: 'USA' },
    { name: 'Washington DC', code: 'WAS', country: 'USA' },
    { name: 'Dallas', code: 'DFW', country: 'USA' },
    { name: 'Houston', code: 'HOU', country: 'USA' },
    { name: 'Atlanta', code: 'ATL', country: 'USA' },
    
    // Europe
    { name: 'London', code: 'LON', country: 'UK' },
    { name: 'Paris', code: 'PAR', country: 'France' },
    { name: 'Berlin', code: 'BER', country: 'Germany' },
    { name: 'Rome', code: 'ROM', country: 'Italy' },
    { name: 'Madrid', code: 'MAD', country: 'Spain' },
    { name: 'Amsterdam', code: 'AMS', country: 'Netherlands' },
    { name: 'Vienna', code: 'VIE', country: 'Austria' },
    { name: 'Prague', code: 'PRG', country: 'Czech Republic' },
    { name: 'Lisbon', code: 'LIS', country: 'Portugal' },
    { name: 'Zurich', code: 'ZRH', country: 'Switzerland' },
    
    // Asia
    { name: 'Tokyo', code: 'TYO', country: 'Japan' },
    { name: 'Dubai', code: 'DXB', country: 'UAE' },
    { name: 'Singapore', code: 'SIN', country: 'Singapore' },
    { name: 'Bangkok', code: 'BKK', country: 'Thailand' },
    { name: 'Seoul', code: 'SEL', country: 'South Korea' },
    { name: 'Shanghai', code: 'SHA', country: 'China' },
    { name: 'Hong Kong', code: 'HKG', country: 'China' },
    { name: 'Kuala Lumpur', code: 'KUL', country: 'Malaysia' },
    { name: 'Taipei', code: 'TPE', country: 'Taiwan' },
    { name: 'Manila', code: 'MNL', country: 'Philippines' },
    
    // Middle East
    { name: 'Doha', code: 'DOH', country: 'Qatar' },
    { name: 'Riyadh', code: 'RUH', country: 'Saudi Arabia' },
    { name: 'Kuwait City', code: 'KWI', country: 'Kuwait' },
    { name: 'Muscat', code: 'MCT', country: 'Oman' },
    { name: 'Bahrain', code: 'BAH', country: 'Bahrain' },
    
    // Australia
    { name: 'Sydney', code: 'SYD', country: 'Australia' },
    { name: 'Melbourne', code: 'MEL', country: 'Australia' },
    { name: 'Brisbane', code: 'BNE', country: 'Australia' },
    { name: 'Perth', code: 'PER', country: 'Australia' },
    
    // Africa
    { name: 'Cape Town', code: 'CPT', country: 'South Africa' },
    { name: 'Nairobi', code: 'NBO', country: 'Kenya' },
    { name: 'Cairo', code: 'CAI', country: 'Egypt' },
    { name: 'Lagos', code: 'LOS', country: 'Nigeria' },
    { name: 'Johannesburg', code: 'JNB', country: 'South Africa' },
];

const airlines = [
    { name: 'Emirates', code: 'EK', logo: '✈️' },
    { name: 'Delta', code: 'DL', logo: '✈️' },
    { name: 'American Airlines', code: 'AA', logo: '✈️' },
    { name: 'United', code: 'UA', logo: '✈️' },
    { name: 'British Airways', code: 'BA', logo: '✈️' },
    { name: 'Air India', code: 'AI', logo: '✈️' },
    { name: 'Singapore Airlines', code: 'SQ', logo: '✈️' },
    { name: 'Lufthansa', code: 'LH', logo: '✈️' },
    { name: 'IndiGo', code: '6E', logo: '✈️' },
    { name: 'SpiceJet', code: 'SG', logo: '✈️' },
    { name: 'Vistara', code: 'UK', logo: '✈️' },
    { name: 'Qatar Airways', code: 'QR', logo: '✈️' },
];

// Get all cities
function getCities() {
    return cities;
}

// Search cities by query
function searchCities(query) {
    if (!query || query.length < 1) return [];
    const lowerQuery = query.toLowerCase();
    return cities.filter(city => 
        city.name.toLowerCase().includes(lowerQuery) ||
        city.code.toLowerCase().includes(lowerQuery) ||
        city.country.toLowerCase().includes(lowerQuery)
    );
}

// Generate flight
function generateFlight(from, to, date) {
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
}

function searchFlights(from, to, date) {
    const flights = [];
    const numFlights = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i < numFlights; i++) {
        flights.push(generateFlight(from, to, date));
    }
    
    flights.sort((a, b) => a.price - b.price);
    return flights;
}

function generateSeatMap(totalSeats = 40) {
    const rows = Math.ceil(totalSeats / 4);
    const cols = 4;
    const seats = [];
    const statuses = ['available', 'available', 'available', 'booked', 'unavailable'];
    
    let seatCount = 0;
    for (let row = 0; row < rows && seatCount < totalSeats; row++) {
        for (let col = 0; col < cols && seatCount < totalSeats; col++) {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            seats.push({
                id: `${String.fromCharCode(65 + row)}${col + 1}`,
                row: String.fromCharCode(65 + row),
                col: col + 1,
                status: status,
                price: status === 'available' ? Math.floor(Math.random() * 50) + 20 : null,
            });
            seatCount++;
        }
    }
    
    return seats;
}

// Helper function
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}