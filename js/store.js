// Application State Management

class Store {
    constructor() {
        this.state = {
            flights: [],
            selectedFlight: null,
            bookingData: {},
            user: null,
            isLoading: false,
            error: null,
        };
        
        this.listeners = [];
        this.loadState();
    }

    loadState() {
        const user = getFromStorage(STORAGE_KEYS.USER);
        const selectedFlight = getFromStorage(STORAGE_KEYS.SELECTED_FLIGHT);
        const bookingData = getFromStorage(STORAGE_KEYS.BOOKING_DATA);
        
        if (user) this.state.user = user;
        if (selectedFlight) this.state.selectedFlight = selectedFlight;
        if (bookingData) this.state.bookingData = bookingData;
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Actions
    setFlights(flights) {
        this.setState({ flights });
    }

    setSelectedFlight(flight) {
        this.setState({ selectedFlight: flight });
        saveToStorage(STORAGE_KEYS.SELECTED_FLIGHT, flight);
    }

    setBookingData(data) {
        this.setState({ bookingData: { ...this.state.bookingData, ...data } });
        saveToStorage(STORAGE_KEYS.BOOKING_DATA, this.state.bookingData);
    }

    clearBookingData() {
        this.setState({ bookingData: {} });
        localStorage.removeItem(STORAGE_KEYS.BOOKING_DATA);
    }

    setUser(user) {
        this.setState({ user });
        saveToStorage(STORAGE_KEYS.USER, user);
    }

    clearUser() {
        this.setState({ user: null });
        localStorage.removeItem(STORAGE_KEYS.USER);
    }

    setLoading(isLoading) {
        this.setState({ isLoading });
    }

    setError(error) {
        this.setState({ error });
    }

    clearError() {
        this.setState({ error: null });
    }
}

const store = new Store();