// Flights Module - Handles flight display and filtering

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
            bookingsList: document.getElementById('bookingsList'),
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

        // Listen for page changes to refresh My Bookings
        window.addEventListener('pageChange', (e) => {
            if (e.detail.page === 'my-bookings') {
                this.displayMyBookings();
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

    // ============================================================
    // MY BOOKINGS DISPLAY
    // ============================================================

    displayMyBookings() {
        const container = this.elements.bookingsList;
        if (!container) return;

        const bookings = getBookings();
        
        if (bookings.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <i class="fas fa-calendar-check" style="font-size: 3rem; color: var(--gray-400);"></i>
                    <h3 style="margin-top: var(--spacing-md);">No Bookings Yet</h3>
                    <p style="color: var(--gray-600);">Start your journey by booking a flight!</p>
                    <button class="btn-primary" onclick="window.navigateToPage('search')">
                        <i class="fas fa-search"></i> Search Flights
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = bookings.map(booking => `
            <div class="booking-item" style="background: var(--white); border-radius: var(--border-radius-lg); padding: var(--spacing-lg); box-shadow: var(--shadow-md); margin-bottom: var(--spacing-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--spacing-md);">
                <div class="booking-info">
                    <div style="font-weight: 700; color: var(--primary); font-size: 1.125rem;">PNR: ${booking.pnr}</div>
                    <div style="color: var(--gray-600);">
                        ${booking.flight.from} → ${booking.flight.to}
                    </div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">
                        ${formatDate(booking.flight.departureDate)} | ${booking.flight.departureTime}
                    </div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">
                        ${booking.flight.airline.name} ${booking.flight.flightNumber}
                    </div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">
                        Seats: ${booking.seats.map(s => s.id).join(', ')}
                    </div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">
                        Passengers: ${booking.passengers.map(p => p.name).join(', ')}
                    </div>
                </div>
                <div class="booking-status" style="text-align: right;">
                    <span class="badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-danger'}">${booking.status.toUpperCase()}</span>
                    <div style="margin-top: var(--spacing-sm); font-weight: 700; color: var(--primary); font-size: 1.125rem;">
                        ${formatCurrency(booking.totalPrice)}
                    </div>
                    ${booking.status === 'confirmed' ? `
                        <button class="btn-danger btn-sm" onclick="window.cancelBooking('${booking.pnr}')" style="margin-top: var(--spacing-sm);">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
}

// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

// Cancel booking
window.cancelBooking = function(pnr) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        const success = cancelBookingByPNR(pnr);
        if (success) {
            if (window.headerModule) {
                window.headerModule.showNotification('Booking cancelled successfully', 'success');
            }
            // Refresh bookings list
            if (window.flightsModule) {
                window.flightsModule.displayMyBookings();
            }
        }
    }
};

// Display My Bookings (for use in app.js)
window.displayMyBookings = function() {
    if (window.flightsModule) {
        window.flightsModule.displayMyBookings();
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.flightsModule = new FlightsModule();
});