// Application State Management
class Store {
    constructor() {
        this.state = {
            flights: [],
            selectedFlight: null,
            user: null,
            isLoading: false,
        };
        
        this.listeners = [];
        this.loadState();
    }

    loadState() {
        const user = getFromStorage(STORAGE_KEYS.USER);
        const selectedFlight = getFromStorage(STORAGE_KEYS.SELECTED_FLIGHT);
        
        if (user) this.state.user = user;
        if (selectedFlight) this.state.selectedFlight = selectedFlight;
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

    setFlights(flights) {
        this.setState({ flights });
    }

    setSelectedFlight(flight) {
        this.setState({ selectedFlight: flight });
        saveToStorage(STORAGE_KEYS.SELECTED_FLIGHT, flight);
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
}

const store = new Store();