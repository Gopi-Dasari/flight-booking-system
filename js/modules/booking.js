// Booking Module - Handles seat selection, passenger details, and booking summary

class BookingModule {
    constructor() {
        this.currentStep = 1;
        this.selectedFlight = null;
        this.selectedSeats = [];
        this.passengers = [];
        this.maxSeats = parseInt(localStorage.getItem('skyTicket_passengerCount')) || 2;
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadSelectedFlight();
    }

    cacheElements() {
        this.elements = {
            bookingContent: document.getElementById('bookingContent'),
        };
    }

    bindEvents() {
        window.addEventListener('pageChange', (e) => {
            if (e.detail.page === 'booking') {
                this.loadSelectedFlight();
            }
        });
    }

    loadSelectedFlight() {
        const stored = localStorage.getItem('skyTicket_selectedFlight');
        if (stored) {
            try {
                this.selectedFlight = JSON.parse(stored);
                this.renderStep1();
            } catch (e) {
                console.error('Error loading selected flight:', e);
            }
        } else {
            if (this.elements.bookingContent) {
                this.elements.bookingContent.innerHTML = `
                    <div style="text-align: center; padding: 3rem;">
                        <i class="fas fa-plane" style="font-size: 3rem; color: var(--gray-400);"></i>
                        <h3 style="margin-top: var(--spacing-md);">No Flight Selected</h3>
                        <p style="color: var(--gray-600);">Please search and select a flight first</p>
                        <button class="btn-primary" onclick="window.navigateToPage('search')">
                            <i class="fas fa-search"></i> Search Flights
                        </button>
                    </div>
                `;
            }
        }
    }

    renderStep1() {
        const flight = this.selectedFlight;
        const seatMap = generateSeatMap(40);
        
        // Filter seats - only show available ones
        const availableSeats = seatMap.filter(s => s.status === 'available');

        this.elements.bookingContent.innerHTML = `
            <div class="booking-content">
                <div class="flight-summary">
                    <h3>Flight Summary</h3>
                    <div class="route">
                        <div class="airport">
                            <div class="code">${flight.from}</div>
                            <div class="city">${formatDate(flight.departureDate)}</div>
                            <div style="font-weight: 600; font-size: var(--font-size-xl);">${flight.departureTime}</div>
                        </div>
                        <div class="arrow">
                            <i class="fas fa-long-arrow-alt-right"></i>
                        </div>
                        <div class="airport">
                            <div class="code">${flight.to}</div>
                            <div class="city">Arrival</div>
                            <div style="font-weight: 600; font-size: var(--font-size-xl);">${flight.arrivalTime}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: var(--spacing-lg); justify-content: center; margin-top: var(--spacing-md); flex-wrap: wrap;">
                        <span><strong>Flight:</strong> ${flight.airline.name} ${flight.flightNumber}</span>
                        <span><strong>Duration:</strong> ${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m</span>
                        <span><strong>Price:</strong> ${formatCurrency(flight.price)}</span>
                    </div>
                    <div style="text-align: center; margin-top: var(--spacing-md); padding: var(--spacing-sm); background: var(--gray-200); border-radius: var(--border-radius-md);">
                        <strong>⚠️ You can select up to ${this.maxSeats} seats only</strong>
                    </div>
                </div>

                <h3>Select Your Seats (Max ${this.maxSeats})</h3>
                <div class="seat-legend">
                    <div class="legend-item"><div class="color-box available"></div>Available</div>
                    <div class="legend-item"><div class="color-box selected"></div>Selected</div>
                    <div class="legend-item"><div class="color-box booked"></div>Booked</div>
                </div>

                <div class="seat-map">
                    ${seatMap.map(seat => `
                        <div class="seat ${seat.status}" data-seat='${JSON.stringify(seat)}' onclick="window.toggleSeat('${seat.id}')">
                            ${seat.id}
                        </div>
                    `).join('')}
                </div>

                <div style="text-align: center; margin: var(--spacing-lg) 0;">
                    <p>Selected: <strong id="selectedSeatCount">0</strong> / ${this.maxSeats} seats</p>
                </div>

                <div class="booking-actions">
                    <button class="btn-secondary" onclick="window.navigateToPage('results')">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="btn-primary" id="proceedToPassengerBtn">
                        Continue <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        const proceedBtn = document.getElementById('proceedToPassengerBtn');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => this.proceedToPassenger());
        }

        this.updateStepProgress(1);
    }

    renderStep2() {
        this.elements.bookingContent.innerHTML = `
            <div class="booking-content">
                <h3>Passenger Details</h3>
                <p style="color: var(--gray-600); margin-bottom: var(--spacing-lg);">
                    Please enter details for all passengers (${this.selectedSeats.length} passengers)
                </p>

                <div id="passengerForms"></div>

                <div class="booking-actions">
                    <button class="btn-secondary" id="backToSeatsBtn">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="btn-primary" id="proceedToPaymentBtn">
                        Proceed to Payment <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        this.passengers = [];
        // Create forms for each selected seat
        for (let i = 0; i < this.selectedSeats.length; i++) {
            this.addPassengerForm(i);
        }

        document.getElementById('backToSeatsBtn').addEventListener('click', () => this.renderStep1());
        document.getElementById('proceedToPaymentBtn').addEventListener('click', () => this.proceedToPayment());

        this.updateStepProgress(2);
    }

    addPassengerForm(index) {
        const container = document.getElementById('passengerForms');

        const form = document.createElement('div');
        form.className = 'passenger-form';
        form.style.border = '1px solid var(--gray-200)';
        form.style.borderRadius = 'var(--border-radius-lg)';
        form.style.padding = 'var(--spacing-lg)';
        form.style.marginBottom = 'var(--spacing-lg)';
        form.innerHTML = `
            <h4 style="margin-bottom: var(--spacing-md);">Passenger ${index + 1} (Seat ${this.selectedSeats[index]?.id || 'N/A'})</h4>
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" class="passenger-name" placeholder="John Doe" required />
                <span class="error-message">Please enter a valid name</span>
            </div>
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" class="passenger-dob" required />
                <span class="error-message">Please enter date of birth</span>
            </div>
            <div class="form-group">
                <label>Passport Number</label>
                <input type="text" class="passenger-passport" placeholder="AB123456" required />
                <span class="error-message">Please enter passport number</span>
            </div>
            <div class="form-group">
                <label>Nationality</label>
                <select class="passenger-nationality" required>
                    <option value="">Select Nationality</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="IN">India</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="JP">Japan</option>
                    <option value="AU">Australia</option>
                </select>
                <span class="error-message">Please select nationality</span>
            </div>
        `;

        container.appendChild(form);

        this.passengers.push({ name: '', dob: '', passport: '', nationality: '' });

        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.validatePassengerForm(form));
            input.addEventListener('blur', () => this.validatePassengerForm(form));
        });
    }

    validatePassengerForm(form) {
        const name = form.querySelector('.passenger-name');
        const dob = form.querySelector('.passenger-dob');
        const passport = form.querySelector('.passenger-passport');
        const nationality = form.querySelector('.passenger-nationality');
        let isValid = true;

        if (!name.value.trim() || name.value.trim().length < 2) {
            name.classList.add('error');
            name.nextElementSibling.classList.add('visible');
            isValid = false;
        } else {
            name.classList.remove('error');
            name.nextElementSibling.classList.remove('visible');
        }

        if (!dob.value) {
            dob.classList.add('error');
            dob.nextElementSibling.classList.add('visible');
            isValid = false;
        } else {
            dob.classList.remove('error');
            dob.nextElementSibling.classList.remove('visible');
        }

        if (!passport.value.trim() || passport.value.trim().length < 5) {
            passport.classList.add('error');
            passport.nextElementSibling.classList.add('visible');
            isValid = false;
        } else {
            passport.classList.remove('error');
            passport.nextElementSibling.classList.remove('visible');
        }

        if (!nationality.value) {
            nationality.classList.add('error');
            nationality.nextElementSibling.classList.add('visible');
            isValid = false;
        } else {
            nationality.classList.remove('error');
            nationality.nextElementSibling.classList.remove('visible');
        }

        return isValid;
    }

    validateAllPassengers() {
        const forms = document.querySelectorAll('.passenger-form');
        let allValid = true;

        forms.forEach((form, index) => {
            const isValid = this.validatePassengerForm(form);
            if (!isValid) allValid = false;

            const name = form.querySelector('.passenger-name').value.trim();
            const dob = form.querySelector('.passenger-dob').value;
            const passport = form.querySelector('.passenger-passport').value.trim();
            const nationality = form.querySelector('.passenger-nationality').value;

            if (this.passengers[index]) {
                this.passengers[index] = { name, dob, passport, nationality };
            }
        });

        return allValid;
    }

    renderStep3() {
        const total = this.selectedFlight.price * this.passengers.length;

        this.elements.bookingContent.innerHTML = `
            <div class="booking-content">
                <h3>Payment Details</h3>
                
                <div style="background: var(--gray-100); padding: var(--spacing-lg); border-radius: var(--border-radius-lg); margin-bottom: var(--spacing-lg);">
                    <h4>Booking Summary</h4>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--gray-200);">
                        <span>Flight: ${this.selectedFlight.airline.name} ${this.selectedFlight.flightNumber}</span>
                        <span>${this.selectedFlight.from} → ${this.selectedFlight.to}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--gray-200);">
                        <span>Passengers: ${this.passengers.length}</span>
                        <span>${formatCurrency(this.selectedFlight.price)} × ${this.passengers.length}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--gray-200);">
                        <span>Seats: ${this.selectedSeats.map(s => s.id).join(', ')}</span>
                        <span>${formatCurrency(this.selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0))}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; font-weight: 700; font-size: var(--font-size-lg); color: var(--primary);">
                        <span>Total</span>
                        <span>${formatCurrency(total)}</span>
                    </div>
                </div>

                <form id="paymentForm">
                    <div class="form-group">
                        <label>Card Number</label>
                        <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required />
                        <span class="error-message">Please enter a valid card number</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                        <div class="form-group">
                            <label>Expiry Date</label>
                            <input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5" required />
                            <span class="error-message">Please enter valid expiry date</span>
                        </div>
                        <div class="form-group">
                            <label>CVV</label>
                            <input type="password" id="cardCvv" placeholder="•••" maxlength="4" required />
                            <span class="error-message">Please enter CVV</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Cardholder Name</label>
                        <input type="text" id="cardName" placeholder="John Doe" required />
                        <span class="error-message">Please enter cardholder name</span>
                    </div>
                </form>

                <div class="booking-actions">
                    <button class="btn-secondary" id="backToPassengerBtn">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="btn-accent" id="confirmBookingBtn">
                        <i class="fas fa-check"></i> Confirm Booking
                    </button>
                </div>
            </div>
        `;

        document.getElementById('backToPassengerBtn').addEventListener('click', () => this.renderStep2());
        document.getElementById('confirmBookingBtn').addEventListener('click', () => this.confirmBooking());

        const cardInput = document.getElementById('cardNumber');
        if (cardInput) {
            cardInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(.{4})/g, '$1 ').trim();
                e.target.value = value;
            });
        }

        const expiryInput = document.getElementById('cardExpiry');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                }
                e.target.value = value;
            });
        }

        this.updateStepProgress(3);
    }

    renderStep4() {
        const pnr = generatePNR();
        const booking = {
            pnr: pnr,
            flight: this.selectedFlight,
            passengers: this.passengers,
            seats: this.selectedSeats,
            totalPrice: this.selectedFlight.price * this.passengers.length,
            bookingDate: new Date().toISOString(),
            status: 'confirmed',
        };

        // Save booking
        saveBooking(booking);
        clearSelectedFlight();

        this.elements.bookingContent.innerHTML = `
            <div class="booking-content" style="text-align: center;">
                <div style="font-size: 4rem; color: var(--success); margin-bottom: var(--spacing-md);">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="color: var(--success);">Booking Confirmed!</h2>
                <p style="color: var(--gray-600);">Your flight has been booked successfully.</p>
                
                <div style="background: var(--gray-100); border-radius: var(--border-radius-lg); padding: var(--spacing-lg); margin: var(--spacing-xl) 0; text-align: left;">
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--gray-200);">
                        <span><strong>PNR Number</strong></span>
                        <span style="font-weight: 700; color: var(--primary); font-size: var(--font-size-xl);">${pnr}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--gray-200);">
                        <span><strong>Flight</strong></span>
                        <span>${this.selectedFlight.airline.name} ${this.selectedFlight.flightNumber}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--gray-200);">
                        <span><strong>Route</strong></span>
                        <span>${this.selectedFlight.from} → ${this.selectedFlight.to}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--gray-200);">
                        <span><strong>Date</strong></span>
                        <span>${formatDate(this.selectedFlight.departureDate)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--gray-200);">
                        <span><strong>Passengers</strong></span>
                        <span>${this.passengers.map(p => p.name).join(', ')}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--gray-200);">
                        <span><strong>Seats</strong></span>
                        <span>${this.selectedSeats.map(s => s.id).join(', ')}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0;">
                        <span><strong>Total Paid</strong></span>
                        <span style="font-weight: 700; color: var(--primary); font-size: var(--font-size-lg);">
                            ${formatCurrency(this.selectedFlight.price * this.passengers.length)}
                        </span>
                    </div>
                </div>

                <div style="display: flex; gap: var(--spacing-md); justify-content: center; flex-wrap: wrap;">
                    <button class="btn-primary" onclick="window.print()">
                        <i class="fas fa-print"></i> Print Ticket
                    </button>
                    <button class="btn-secondary" onclick="window.navigateToPage('my-bookings')">
                        <i class="fas fa-calendar-check"></i> View My Bookings
                    </button>
                    <button class="btn-outline" onclick="window.navigateToPage('search')">
                        <i class="fas fa-search"></i> Book Another Flight
                    </button>
                </div>
            </div>
        `;

        this.updateStepProgress(4);
    }

    proceedToPassenger() {
        if (this.selectedSeats.length === 0) {
            if (window.headerModule) {
                window.headerModule.showNotification('Please select at least one seat', 'error');
            }
            return;
        }
        this.renderStep2();
    }

    proceedToPayment() {
        if (!this.validateAllPassengers()) {
            if (window.headerModule) {
                window.headerModule.showNotification('Please fill all passenger details correctly', 'error');
            }
            return;
        }
        this.renderStep3();
    }

    confirmBooking() {
        const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('cardExpiry')?.value;
        const cardCvv = document.getElementById('cardCvv')?.value;
        const cardName = document.getElementById('cardName')?.value.trim();

        if (!cardNumber || cardNumber.length < 16) {
            this.showFieldError('cardNumber', 'Please enter a valid card number');
            return;
        }

        if (!cardExpiry || !cardExpiry.match(/^\d{2}\/\d{2}$/)) {
            this.showFieldError('cardExpiry', 'Please enter valid expiry date (MM/YY)');
            return;
        }

        if (!cardCvv || cardCvv.length < 3) {
            this.showFieldError('cardCvv', 'Please enter valid CVV');
            return;
        }

        if (!cardName || cardName.length < 2) {
            this.showFieldError('cardName', 'Please enter cardholder name');
            return;
        }

        if (window.headerModule) {
            window.headerModule.showNotification('Processing payment...', 'info');
        }

        setTimeout(() => {
            this.renderStep4();
        }, 1500);
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('error');
            const errorMsg = field.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.textContent = message;
                errorMsg.classList.add('visible');
            }
        }
    }

    updateStepProgress(step) {
        const steps = document.querySelectorAll('.step');
        steps.forEach((s, index) => {
            s.classList.remove('active', 'completed');
            if (index + 1 < step) {
                s.classList.add('completed');
            } else if (index + 1 === step) {
                s.classList.add('active');
            }
        });
    }

    toggleSeat(seatId) {
        const seatElements = document.querySelectorAll('.seat');
        let seatData = null;
        let seatElement = null;

        seatElements.forEach(el => {
            const data = JSON.parse(el.dataset.seat);
            if (data.id === seatId) {
                seatData = data;
                seatElement = el;
            }
        });

        if (!seatData || seatData.status === 'booked' || seatData.status === 'unavailable') {
            return;
        }

        // Check if max seats reached
        if (seatData.status === 'available' && this.selectedSeats.length >= this.maxSeats) {
            if (window.headerModule) {
                window.headerModule.showNotification(`You can only select up to ${this.maxSeats} seats`, 'error');
            }
            return;
        }

        if (seatData.status === 'available') {
            seatData.status = 'selected';
            seatElement.classList.remove('available');
            seatElement.classList.add('selected');
            this.selectedSeats.push(seatData);
        } else if (seatData.status === 'selected') {
            seatData.status = 'available';
            seatElement.classList.remove('selected');
            seatElement.classList.add('available');
            this.selectedSeats = this.selectedSeats.filter(s => s.id !== seatData.id);
        }

        const countEl = document.getElementById('selectedSeatCount');
        if (countEl) {
            countEl.textContent = this.selectedSeats.length;
        }
    }
}

window.toggleSeat = (seatId) => {
    if (window.bookingModule) {
        window.bookingModule.toggleSeat(seatId);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.bookingModule = new BookingModule();
});