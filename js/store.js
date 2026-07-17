class Store {
    constructor() {
        this.state = {
            flights: [],
            selectedFlight: null,
            isLoading: false,
        };
        
        this.listeners = [];
        this.loadState();
    }

    loadState() {
        const selectedFlight = window.getSelectedFlight ? window.getSelectedFlight() : null;
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
        if (window.saveSelectedFlight) {
            window.saveSelectedFlight(flight);
        }
    }

    setLoading(isLoading) {
        this.setState({ isLoading });
    }
}

const store = new Store();
window.store = store;
console.log('✅ Store initialized');