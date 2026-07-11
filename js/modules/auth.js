import { isValidEmail } from '../utils/helpers.js';

class AuthModule {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        setTimeout(() => {
            this.cacheElements();
            this.bindEvents();
            this.setupPasswordToggle();
        }, 150);
    }

    cacheElements() {
        this.loginModal = document.getElementById('loginModal');
        this.signupModal = document.getElementById('signupModal');
        
        this.elements = {
            loginForm: document.getElementById('loginForm'),
            loginEmail: document.getElementById('loginEmail'),
            loginPassword: document.getElementById('loginPassword'),
            loginEmailError: document.getElementById('loginEmailError'),
            loginPasswordError: document.getElementById('loginPasswordError'),
            rememberMe: document.getElementById('rememberMe'),
            closeLogin: document.getElementById('closeLoginModal'),
            switchToSignup: document.getElementById('switchToSignup'),

            signupForm: document.getElementById('signupForm'),
            signupName: document.getElementById('signupName'),
            signupEmail: document.getElementById('signupEmail'),
            signupPassword: document.getElementById('signupPassword'),
            signupConfirm: document.getElementById('signupConfirmPassword'),
            signupNameError: document.getElementById('signupNameError'),
            signupEmailError: document.getElementById('signupEmailError'),
            signupPasswordError: document.getElementById('signupPasswordError'),
            signupConfirmError: document.getElementById('signupConfirmError'),
            signupTermsError: document.getElementById('signupTermsError'),
            agreeTerms: document.getElementById('agreeTerms'),
            closeSignup: document.getElementById('closeSignupModal'),
            switchToLogin: document.getElementById('switchToLogin'),
        };
    }

    bindEvents() {
        if (this.elements.loginForm) {
            this.elements.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (this.elements.signupForm) {
            this.elements.signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        if (this.elements.closeLogin) {
            this.elements.closeLogin.addEventListener('click', () => this.closeModal('login'));
        }
        if (this.elements.closeSignup) {
            this.elements.closeSignup.addEventListener('click', () => this.closeModal('signup'));
        }

        if (this.elements.switchToSignup) {
            this.elements.switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal('login');
                this.openModal('signup');
            });
        }

        if (this.elements.switchToLogin) {
            this.elements.switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal('signup');
                this.openModal('login');
            });
        }

        if (this.loginModal) {
            this.loginModal.addEventListener('click', (e) => {
                if (e.target === this.loginModal) {
                    this.closeModal('login');
                }
            });
        }

        if (this.signupModal) {
            this.signupModal.addEventListener('click', (e) => {
                if (e.target === this.signupModal) {
                    this.closeModal('signup');
                }
            });
        }

        if (this.elements.loginEmail) {
            this.elements.loginEmail.addEventListener('blur', () => this.validateLoginEmail());
            this.elements.loginPassword.addEventListener('blur', () => this.validateLoginPassword());
        }

        if (this.elements.signupName) {
            this.elements.signupName.addEventListener('blur', () => this.validateSignupName());
            this.elements.signupEmail.addEventListener('blur', () => this.validateSignupEmail());
            this.elements.signupPassword.addEventListener('blur', () => this.validateSignupPassword());
            this.elements.signupConfirm.addEventListener('blur', () => this.validateSignupConfirm());
        }
    }

    setupPasswordToggle() {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.target;
                const input = document.getElementById(targetId);
                if (input) {
                    const type = input.type === 'password' ? 'text' : 'password';
                    input.type = type;
                    button.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                }
            });
        });
    }

    openModal(type) {
        if (type === 'login' && this.loginModal) {
            this.loginModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            if (this.elements.loginEmail) this.elements.loginEmail.focus();
        } else if (type === 'signup' && this.signupModal) {
            this.signupModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            if (this.elements.signupName) this.elements.signupName.focus();
        }
    }

    closeModal(type) {
        if (type === 'login' && this.loginModal) {
            this.loginModal.classList.add('hidden');
        } else if (type === 'signup' && this.signupModal) {
            this.signupModal.classList.add('hidden');
        }
        document.body.style.overflow = '';
        
        if (type === 'login' && this.elements.loginForm) {
            this.elements.loginForm.reset();
            this.clearLoginErrors();
        } else if (type === 'signup' && this.elements.signupForm) {
            this.elements.signupForm.reset();
            this.clearSignupErrors();
        }
    }

    handleLogin() {
        const email = this.elements.loginEmail.value.trim();
        const password = this.elements.loginPassword.value;

        if (!this.validateLoginEmail() || !this.validateLoginPassword()) {
            return;
        }

        const users = JSON.parse(localStorage.getItem('skyTicket_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const userData = {
                name: user.name,
                email: user.email,
                id: user.id,
                memberSince: user.memberSince,
            };
            
            if (window.headerModule) {
                window.headerModule.login(userData);
            } else {
                localStorage.setItem('skyTicket_user', JSON.stringify(userData));
                window.location.reload();
            }
            
            this.closeModal('login');
        } else {
            const emailExists = users.some(u => u.email === email);
            if (!emailExists) {
                this.showError(this.elements.loginEmailError, 'No account found with this email');
            } else {
                this.showError(this.elements.loginPasswordError, 'Incorrect password');
            }
        }
    }

    handleSignup() {
        const name = this.elements.signupName.value.trim();
        const email = this.elements.signupEmail.value.trim();
        const password = this.elements.signupPassword.value;
        const confirm = this.elements.signupConfirm.value;

        const isNameValid = this.validateSignupName();
        const isEmailValid = this.validateSignupEmail();
        const isPasswordValid = this.validateSignupPassword();
        const isConfirmValid = this.validateSignupConfirm();

        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
            return;
        }

        if (!this.elements.agreeTerms.checked) {
            this.showError(this.elements.signupTermsError, 'You must agree to the terms');
            return;
        }

        const users = JSON.parse(localStorage.getItem('skyTicket_users') || '[]');
        if (users.some(u => u.email === email)) {
            this.showError(this.elements.signupEmailError, 'This email is already registered');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            memberSince: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem('skyTicket_users', JSON.stringify(users));

        const userData = {
            name: newUser.name,
            email: newUser.email,
            id: newUser.id,
            memberSince: newUser.memberSince,
        };

        if (window.headerModule) {
            window.headerModule.login(userData);
        } else {
            localStorage.setItem('skyTicket_user', JSON.stringify(userData));
            window.location.reload();
        }

        this.closeModal('signup');
    }

    validateLoginEmail() {
        const email = this.elements.loginEmail.value.trim();
        if (!email) {
            this.showError(this.elements.loginEmailError, 'Email is required');
            return false;
        }
        if (!isValidEmail(email)) {
            this.showError(this.elements.loginEmailError, 'Please enter a valid email');
            return false;
        }
        this.clearError(this.elements.loginEmailError);
        return true;
    }

    validateLoginPassword() {
        const password = this.elements.loginPassword.value;
        if (!password) {
            this.showError(this.elements.loginPasswordError, 'Password is required');
            return false;
        }
        if (password.length < 6) {
            this.showError(this.elements.loginPasswordError, 'Password must be at least 6 characters');
            return false;
        }
        this.clearError(this.elements.loginPasswordError);
        return true;
    }

    validateSignupName() {
        const name = this.elements.signupName.value.trim();
        if (!name) {
            this.showError(this.elements.signupNameError, 'Full name is required');
            return false;
        }
        if (name.length < 2) {
            this.showError(this.elements.signupNameError, 'Name must be at least 2 characters');
            return false;
        }
        this.clearError(this.elements.signupNameError);
        return true;
    }

    validateSignupEmail() {
        const email = this.elements.signupEmail.value.trim();
        if (!email) {
            this.showError(this.elements.signupEmailError, 'Email is required');
            return false;
        }
        if (!isValidEmail(email)) {
            this.showError(this.elements.signupEmailError, 'Please enter a valid email');
            return false;
        }
        this.clearError(this.elements.signupEmailError);
        return true;
    }

    validateSignupPassword() {
        const password = this.elements.signupPassword.value;
        if (!password) {
            this.showError(this.elements.signupPasswordError, 'Password is required');
            return false;
        }
        if (password.length < 8) {
            this.showError(this.elements.signupPasswordError, 'Password must be at least 8 characters');
            return false;
        }
        this.clearError(this.elements.signupPasswordError);
        return true;
    }

    validateSignupConfirm() {
        const password = this.elements.signupPassword.value;
        const confirm = this.elements.signupConfirm.value;
        if (!confirm) {
            this.showError(this.elements.signupConfirmError, 'Please confirm your password');
            return false;
        }
        if (password !== confirm) {
            this.showError(this.elements.signupConfirmError, 'Passwords do not match');
            return false;
        }
        this.clearError(this.elements.signupConfirmError);
        return true;
    }

    showError(element, message) {
        if (!element) return;
        element.textContent = message;
        element.classList.add('visible');
        const input = element.closest('.form-group')?.querySelector('input');
        if (input) input.classList.add('error');
    }

    clearError(element) {
        if (!element) return;
        element.textContent = '';
        element.classList.remove('visible');
        const input = element.closest('.form-group')?.querySelector('input');
        if (input) input.classList.remove('error');
    }

    clearLoginErrors() {
        this.clearError(this.elements.loginEmailError);
        this.clearError(this.elements.loginPasswordError);
    }

    clearSignupErrors() {
        this.clearError(this.elements.signupNameError);
        this.clearError(this.elements.signupEmailError);
        this.clearError(this.elements.signupPasswordError);
        this.clearError(this.elements.signupConfirmError);
        this.clearError(this.elements.signupTermsError);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.authModule = new AuthModule();
    window.openLoginModal = () => window.authModule.openModal('login');
    window.openSignupModal = () => window.authModule.openModal('signup');
});