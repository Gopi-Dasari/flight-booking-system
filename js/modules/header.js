import { getInitials } from '../utils/helpers.js';

class HeaderModule {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
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
            this.checkAuthStatus();
            this.handleScroll();
        }, 100);
    }

    cacheElements() {
        this.elements = {
            header: document.getElementById('main-header'),
            navMenu: document.getElementById('navMenu'),
            hamburger: document.getElementById('hamburgerBtn'),
            loginBtn: document.getElementById('loginBtn'),
            signupBtn: document.getElementById('signupBtn'),
            mobileLoginBtn: document.getElementById('mobileLoginBtn'),
            mobileSignupBtn: document.getElementById('mobileSignupBtn'),
            logoutBtn: document.getElementById('logoutBtn'),
            userProfile: document.getElementById('userProfile'),
            authButtons: document.getElementById('authButtons'),
            mobileAuthButtons: document.getElementById('mobileAuthButtons'),
            userAvatar: document.getElementById('userAvatar'),
            userName: document.getElementById('userName'),
            dropdownMenu: document.getElementById('dropdownMenu'),
            navLinks: document.querySelectorAll('.nav-menu ul li a'),
            logo: document.getElementById('logoLink'),
        };
    }

    bindEvents() {
        if (this.elements.hamburger) {
            this.elements.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        if (this.elements.loginBtn) {
            this.elements.loginBtn.addEventListener('click', () => this.openModal('login'));
        }
        if (this.elements.mobileLoginBtn) {
            this.elements.mobileLoginBtn.addEventListener('click', () => this.openModal('login'));
        }

        if (this.elements.signupBtn) {
            this.elements.signupBtn.addEventListener('click', () => this.openModal('signup'));
        }
        if (this.elements.mobileSignupBtn) {
            this.elements.mobileSignupBtn.addEventListener('click', () => this.openModal('signup'));
        }

        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(link.dataset.page);
                this.closeMobileMenu();
            });
        });

        if (this.elements.userProfile) {
            this.elements.userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        document.addEventListener('click', (e) => {
            if (this.elements.userProfile && !this.elements.userProfile.contains(e.target)) {
                this.closeDropdown();
            }
        });

        if (this.elements.logo) {
            this.elements.logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('search');
            });
        }

        window.addEventListener('scroll', () => this.handleScroll());

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.elements.navMenu) {
            this.elements.navMenu.classList.toggle('active');
            const icon = this.elements.hamburger.querySelector('i');
            if (this.elements.navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        }
    }

    closeMobileMenu() {
        if (this.elements.navMenu) {
            this.elements.navMenu.classList.remove('active');
            const icon = this.elements.hamburger.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    }

    toggleDropdown() {
        if (this.elements.dropdownMenu) {
            this.elements.dropdownMenu.classList.toggle('active');
        }
    }

    closeDropdown() {
        if (this.elements.dropdownMenu) {
            this.elements.dropdownMenu.classList.remove('active');
        }
    }

    navigateTo(page) {
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });

        if (window.navigateToPage) {
            window.navigateToPage(page);
        }

        this.closeMobileMenu();
    }

    openModal(type) {
        if (window.authModule) {
            window.authModule.openModal(type);
        }
    }

    checkAuthStatus() {
        const storedUser = localStorage.getItem('skyTicket_user');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
                this.isLoggedIn = true;
                this.updateUIForLoggedIn();
            } catch (e) {
                console.error('Error parsing user data:', e);
                this.logout();
            }
        } else {
            this.isLoggedIn = false;
            this.updateUIForLoggedOut();
        }
    }

    updateUIForLoggedIn() {
        if (this.elements.authButtons) {
            this.elements.authButtons.style.display = 'none';
        }
        if (this.elements.mobileAuthButtons) {
            this.elements.mobileAuthButtons.style.display = 'none';
        }
        if (this.elements.userProfile) {
            this.elements.userProfile.classList.remove('hidden');
            this.elements.userAvatar.textContent = this.currentUser?.name 
                ? getInitials(this.currentUser.name) 
                : 'U';
            this.elements.userName.textContent = this.currentUser?.name || 'User';
        }
    }

    updateUIForLoggedOut() {
        if (this.elements.authButtons) {
            this.elements.authButtons.style.display = 'flex';
        }
        if (this.elements.mobileAuthButtons) {
            this.elements.mobileAuthButtons.style.display = 'flex';
        }
        if (this.elements.userProfile) {
            this.elements.userProfile.classList.add('hidden');
        }
        this.closeDropdown();
    }

    logout() {
        localStorage.removeItem('skyTicket_user');
        this.isLoggedIn = false;
        this.currentUser = null;
        this.updateUIForLoggedOut();
        this.showNotification('Logged out successfully', 'success');
    }

    login(userData) {
        localStorage.setItem('skyTicket_user', JSON.stringify(userData));
        this.currentUser = userData;
        this.isLoggedIn = true;
        this.updateUIForLoggedIn();
        this.showNotification(`Welcome back, ${userData.name}!`, 'success');
    }

    handleScroll() {
        if (this.elements.header) {
            if (window.scrollY > 50) {
                this.elements.header.classList.add('scrolled');
            } else {
                this.elements.header.classList.remove('scrolled');
            }
        }
    }

    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '90px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '12px',
            background: type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#2a5a9a',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '9999',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '280px',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease',
            cursor: 'pointer',
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.headerModule = new HeaderModule();
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification {
        animation: slideInRight 0.3s ease;
    }
    .notification-close {
        background: none;
        border: none;
        color: #fff;
        opacity: 0.7;
        padding: 0 0 0 10px;
        font-size: 16px;
        cursor: pointer;
    }
    .notification-close:hover {
        opacity: 1;
    }
    .page-section {
        display: none;
    }
    .page-section.active {
        display: block;
    }
`;
document.head.appendChild(style);