class SearchModule {
    constructor() {
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.setDefaultDates();
        this.setupAutocomplete();
    }

    cacheElements() {
        this.elements = {
            searchForm: document.getElementById('searchForm'),
            fromInput: document.getElementById('fromInput'),
            toInput: document.getElementById('toInput'),
            departureDate: document.getElementById('departureDate'),
            passengerCount: document.getElementById('passengerCount'),
            resultsContainer: document.getElementById('flightResults'),
            resultsInfo: document.getElementById('resultsInfo'),
            fromDropdown: document.getElementById('fromDropdown'),
            toDropdown: document.getElementById('toDropdown'),
        };
    }

    bindEvents() {
        if (this.elements.searchForm) {
            this.elements.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch();
            });
        }

        document.querySelectorAll('.dest-card').forEach(card => {
            card.addEventListener('click', () => {
                const from = card.dataset.from;
                const to = card.dataset.to;
                if (this.elements.fromInput) this.elements.fromInput.value = from;
                if (this.elements.toInput) this.elements.toInput.value = to;
                if (this.elements.fromInput) delete this.elements.fromInput.dataset.selectedCity;
                if (this.elements.toInput) delete this.elements.toInput.dataset.selectedCity;
                this.performSearch();
            });
        });
    }

    setupAutocomplete() {
        if (this.elements.fromInput) {
            this.elements.fromInput.addEventListener('input', (e) => {
                const query = e.target.value;
                const dropdown = this.elements.fromDropdown;
                this.showAutocompleteSuggestions(query, dropdown, this.elements.fromInput);
            });
            this.elements.fromInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (this.elements.fromDropdown) {
                        this.elements.fromDropdown.classList.remove('active');
                    }
                }, 200);
            });
        }

        if (this.elements.toInput) {
            this.elements.toInput.addEventListener('input', (e) => {
                const query = e.target.value;
                const dropdown = this.elements.toDropdown;
                this.showAutocompleteSuggestions(query, dropdown, this.elements.toInput);
            });
            this.elements.toInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (this.elements.toDropdown) {
                        this.elements.toDropdown.classList.remove('active');
                    }
                }, 200);
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.autocomplete-dropdown').forEach(d => {
                    d.classList.remove('active');
                });
            }
        });
    }

    showAutocompleteSuggestions(query, dropdown, input) {
        if (!dropdown) return;
        
        if (!query || query.length < 1) {
            dropdown.classList.remove('active');
            return;
        }

        const suggestions = window.searchCities ? window.searchCities(query) : [];
        
        if (suggestions.length === 0) {
            dropdown.innerHTML = `
                <div class="autocomplete-item" style="color: var(--gray-500); cursor: default;">
                    No cities found
                </div>
            `;
            dropdown.classList.add('active');
            return;
        }

        dropdown.innerHTML = suggestions.map(city => `
            <div class="autocomplete-item" data-city='${JSON.stringify(city)}'>
                <span class="city-name">${city.name}</span>
                <span class="city-code">(${city.code})</span>
                <span class="country">${city.country}</span>
            </div>
        `).join('');

        dropdown.classList.add('active');

        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const city = JSON.parse(item.dataset.city);
                input.value = city.name;
                input.dataset.selectedCity = JSON.stringify(city);
                dropdown.classList.remove('active');
            });
        });
    }

    setDefaultDates() {
        if (this.elements.departureDate) {
            const today = new Date();
            const future = new Date(today);
            future.setDate(today.getDate() + 7);
            this.elements.departureDate.value = future.toISOString().split('T')[0];
        }
    }

    performSearch() {
        const fromInput = this.elements.fromInput;
        const toInput = this.elements.toInput;
        
        let from = fromInput.value.trim();
        let to = toInput.value.trim();
        
        if (fromInput.dataset.selectedCity) {
            const city = JSON.parse(fromInput.dataset.selectedCity);
            from = city.name;
        }
        
        if (toInput.dataset.selectedCity) {
            const city = JSON.parse(toInput.dataset.selectedCity);
            to = city.name;
        }

        const date = this.elements.departureDate.value;
        const passengers = this.elements.passengerCount.value;

        if (!from || !to) {
            alert('Please enter both departure and destination cities');
            return;
        }

        if (!date) {
            alert('Please select a departure date');
            return;
        }

        localStorage.setItem('skyTicket_passengerCount', passengers);
        this.showLoading();

        setTimeout(() => {
            const flights = window.searchFlights ? window.searchFlights(from, to, date) : [];
            this.displayResults(flights, { from, to, date, passengers });
            
            if (window.navigateToPage) {
                window.navigateToPage('results');
            }
        }, 1000);
    }

    showLoading() {
        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.innerHTML = `
                <div class="loading-results">
                    <div class="spinner"></div>
                    <p style="margin-top: var(--spacing-md); color: var(--gray-600);">
                        Searching for flights...
                    </p>
                </div>
            `;
        }
    }

    displayResults(flights, searchParams) {
        if (this.elements.resultsContainer) {
            if (flights.length === 0) {
                this.elements.resultsContainer.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-plane-slash"></i>
                        <h3>No flights found</h3>
                        <p>Try adjusting your search criteria</p>
                    </div>
                `;
                return;
            }

            if (this.elements.resultsInfo) {
                this.elements.resultsInfo.textContent = 
                    `${flights.length} flights found from ${searchParams.from} to ${searchParams.to}`;
            }

            this.elements.resultsContainer.innerHTML = flights.map(flight => `
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
                                ${flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}
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
                            <div class="price">$${flight.price} <small>per person</small></div>
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
}

window.selectFlight = (flightId) => {
    const cards = document.querySelectorAll('.flight-card');
    let selectedFlight = null;
    
    cards.forEach(card => {
        const flight = JSON.parse(card.dataset.flight);
        if (flight.id === flightId) {
            selectedFlight = flight;
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });

    if (selectedFlight) {
        localStorage.setItem('skyTicket_selectedFlight', JSON.stringify(selectedFlight));
        if (window.navigateToPage) {
            window.navigateToPage('booking');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.searchModule = new SearchModule();
});