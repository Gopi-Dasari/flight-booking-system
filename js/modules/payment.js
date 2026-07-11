import { formatCurrency } from '../utils/helpers.js';

class PaymentModule {
    constructor() {
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
    }

    cacheElements() {
        this.elements = {
            paymentForm: document.getElementById('paymentForm'),
            cardNumber: document.getElementById('cardNumber'),
            cardExpiry: document.getElementById('cardExpiry'),
            cardCvv: document.getElementById('cardCvv'),
            cardName: document.getElementById('cardName'),
        };
    }

    bindEvents() {
        if (this.elements.cardNumber) {
            this.elements.cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(.{4})/g, '$1 ').trim();
                e.target.value = value;
            });
        }

        if (this.elements.cardExpiry) {
            this.elements.cardExpiry.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                }
                e.target.value = value;
            });
        }

        if (this.elements.cardCvv) {
            this.elements.cardCvv.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }
    }

    validatePayment() {
        const cardNumber = this.elements.cardNumber?.value.replace(/\s/g, '');
        const cardExpiry = this.elements.cardExpiry?.value;
        const cardCvv = this.elements.cardCvv?.value;
        const cardName = this.elements.cardName?.value.trim();

        let isValid = true;

        if (!cardNumber || cardNumber.length < 16) {
            this.showError('cardNumber', 'Please enter a valid card number');
            isValid = false;
        }

        if (!cardExpiry || !cardExpiry.match(/^\d{2}\/\d{2}$/)) {
            this.showError('cardExpiry', 'Please enter valid expiry date (MM/YY)');
            isValid = false;
        }

        if (!cardCvv || cardCvv.length < 3) {
            this.showError('cardCvv', 'Please enter valid CVV');
            isValid = false;
        }

        if (!cardName || cardName.length < 2) {
            this.showError('cardName', 'Please enter cardholder name');
            isValid = false;
        }

        return isValid;
    }

    showError(fieldId, message) {
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

    clearErrors() {
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        document.querySelectorAll('.error-message.visible').forEach(el => {
            el.classList.remove('visible');
        });
    }

    processPayment(amount, callback) {
        if (this.validatePayment()) {
            if (window.headerModule) {
                window.headerModule.showNotification('Processing payment...', 'info');
            }

            setTimeout(() => {
                if (callback) callback(true);
            }, 1500);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.paymentModule = new PaymentModule();
});