// Main Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('✈️ SkyTicket Application Starting...');
    
    // Clear container first to prevent duplicates
    document.getElementById('header-container').innerHTML = '';
    
    // Load header template
    loadHeader();
    
    // Load other components
    loadComponent('modal-container', 'templates/login-modal.html');
    loadComponent('modal-container', 'templates/signup-modal.html', true);
    loadComponent('footer-container', 'templates/footer.html');
    
    // Initialize modules after everything loads
    setTimeout(function() {
        initializeModules();
    }, 500);
});

function loadHeader() {
    const container = document.getElementById('header-container');
    if (!container) return;
    
    fetch('templates/header.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load header');
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            console.log('✅ Header loaded');
            
            // Initialize header module AFTER header is in DOM
            if (window.HeaderModule) {
                window.headerModule = new window.HeaderModule();
            }
            
            // Initialize auth module AFTER header is loaded
            if (window.AuthModule) {
                window.authModule = new window.AuthModule();
            }
        })
        .catch(error => {
            console.error('❌ Error loading header:', error);
            container.innerHTML = `
                <div style="padding: 1rem; background: #dc3545; color: white; text-align: center;">
                    <h4>Failed to load header</h4>
                    <p>Please ensure you're using a local server.</p>
                </div>
            `;
        });
}

function loadComponent(containerId, templatePath, append = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    fetch(templatePath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(html => {
            if (append) {
                container.innerHTML += html;
            } else {
                container.innerHTML = html;
            }
            console.log(`✅ Loaded: ${templatePath}`);
        })
        .catch(error => {
            console.error(`❌ Error loading ${templatePath}:`, error);
        });
}

function initializeModules() {
    // Initialize search module
    if (window.SearchModule && !window.searchModule) {
        window.searchModule = new window.SearchModule();
    }
    
    // Initialize flights module
    if (window.FlightsModule && !window.flightsModule) {
        window.flightsModule = new window.FlightsModule();
    }
    
    // Initialize booking module
    if (window.BookingModule && !window.bookingModule) {
        window.bookingModule = new window.BookingModule();
    }
    
    // Initialize payment module
    if (window.PaymentModule && !window.paymentModule) {
        window.paymentModule = new window.PaymentModule();
    }
    
    console.log('✅ All modules initialized');
}

function navigateToPage(page) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.querySelector(`#${page}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    window.location.hash = page;
    window.dispatchEvent(new CustomEvent('pageChange', { detail: { page } }));
}

window.addEventListener('hashchange', function() {
    const page = window.location.hash.replace('#', '') || 'search';
    navigateToPage(page);
});

if (window.location.hash) {
    const page = window.location.hash.replace('#', '');
    navigateToPage(page);
}

window.navigateToPage = navigateToPage;
window.loadComponent = loadComponent;