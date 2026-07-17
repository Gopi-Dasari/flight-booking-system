class HeaderModule {
    constructor() {
        this.init();
    }

    init() {
        setTimeout(() => {
            this.cacheElements();
            this.bindEvents();
            this.handleScroll();
            console.log('✅ HeaderModule initialized');
        }, 100);
    }

    cacheElements() {
        this.elements = {
            header: document.getElementById('main-header'),
            navMenu: document.getElementById('navMenu'),
            hamburger: document.getElementById('hamburgerBtn'),
            navLinks: document.querySelectorAll('.nav-menu ul li a'),
            logo: document.getElementById('logoLink'),
        };
    }

    bindEvents() {
        if (this.elements.hamburger) {
            this.elements.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        if (this.elements.navLinks) {
            this.elements.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = link.dataset.page;
                    if (page && window.navigateToPage) {
                        window.navigateToPage(page);
                    }
                    this.closeMobileMenu();
                });
            });
        }

        if (this.elements.logo) {
            this.elements.logo.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.navigateToPage) window.navigateToPage('search');
                this.closeMobileMenu();
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
            const icon = this.elements.hamburger?.querySelector('i');
            if (icon) {
                icon.className = this.elements.navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        }
    }

    closeMobileMenu() {
        if (this.elements.navMenu) {
            this.elements.navMenu.classList.remove('active');
            const icon = this.elements.hamburger?.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
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
}

document.addEventListener('DOMContentLoaded', () => {
    window.headerModule = new HeaderModule();
});

if (!document.querySelector('#headerStyles')) {
    const style = document.createElement('style');
    style.id = 'headerStyles';
    style.textContent = `
        .page-section { display: none; }
        .page-section.active { display: block; }
        .nav-divider { width: 1px; height: 30px; background: var(--gray-300); margin: 0 var(--spacing-xs); }
        @media (max-width: 768px) { .nav-divider { display: none; } }
    `;
    document.head.appendChild(style);
}