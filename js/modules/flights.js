import { formatCurrency } from '../utils/helpers.js';
import { store } from '../store.js';

class FlightsModule {
    constructor() {
        this.flights = [];
        this.filteredFlights = [];
        this.sortBy = 'price';
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadFlights();
    }

    cacheElements() {
        this.elements = {
            resultsContainer: document.getElementById('flightResults'),
            sortFilter: document.getElementById('sortFilter'),
            resultsInfo: document.getElementById('resultsInfo'),
        };
    }

    bindEvents() {
        if (this.elements.sortFilter) {
            this.elements.sortFilter.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.sortAndDisplayFlights();
            });
        }

        store.subscribe((state) => {
            if (state.flights.length > 0) {
                this.flights = state.flights;
                this.filteredFlights = [...this.flights];
                this.displayFlights();
            }
        });
    }

    loadFlights() {
        const state = store.getState();
        if (state.flights.length > 0) {
            this.flights = state.flights;
            this.filteredFlights = [...this.flights];
            this.displayFlights();
        }
    }

    sortAndDisplayFlights() {
        this.filteredFlights = this.sortFlights([...this.filteredFlights]);
        this.displayFlights();
    }

    sortFlights(flights) {
        switch (this.sortBy) {
            case 'price':
                return flights.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return flights.sort((a, b) => b.price - a.price);
            case 'departure':
                return flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
            case 'duration':
                return flights.sort((a, b) => a.duration - b.duration);
            default:
                return flights;
        }
    }

    displayFlights() {
        if (!this.elements.resultsContainer) return;

        if (this.filteredFlights.length === 0) {
            this.elements.resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-plane-slash"></i>
                    <h3>No flights match your criteria</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }

        if (this.elements.resultsInfo) {
            this.elements.resultsInfo.textContent = 
                `${this.filteredFlights.length} flights available`;
        }

        this.elements.resultsContainer.innerHTML = this.filteredFlights.map(flight => `
            <div class="flight-card" data-flight='${JSON.stringify(flight)}'>
                <div class="airline">
                    <div class="avatar">${flight.airline.logo}</div>
                    <div>
                        <div class="name">${flight.airline.name}</div>
                        <div class="code">${flight.flightNumber}</div>
                    </div>
                </div>
                
                <div class="flight-info">
                    <div>
                        <div class="time">${flight.departureTime}</div>
                        <div class="city">${flight.from}</div>
                    </div>
                    <div class="duration">
                        <i class="fas fa-plane"></i>
                        <div>${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m</div>
                        <div style="font-size: var(--font-size-xs); color: var(--gray-500);">
                            ${flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </div>
                    </div>
                    <div>
                        <div class="time">${flight.arrivalTime}</div>
                        <div class="city">${flight.to}</div>
                    </div>
                </div>
                
                <div class="tags">
                    ${flight.stops === 0 ? '<span class="tag tag-refundable">Direct</span>' : ''}
                    <span class="tag tag-luggage">20kg Baggage</span>
                    <span class="tag tag-meal">Meal Included</span>
                </div>
                
                <div class="flight-footer">
                    <div>
                        <div class="price">${formatCurrency(flight.price)} <small>per person</small></div>
                        <div class="stops">${flight.seatsAvailable} seats left</div>
                    </div>
                    <button class="btn-select" onclick="window.selectFlight('${flight.id}')">
                        Select Flight
                    </button>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.flightsModule = new FlightsModule();
});