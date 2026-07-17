document.addEventListener('DOMContentLoaded', function() {
    console.log('✈️ SkyTicket Application Starting...');
    
    window.headerModule = new HeaderModule();
    
    setTimeout(function() {
        window.searchModule = new SearchModule();
        window.flightsModule = new FlightsModule();
        window.bookingModule = new BookingModule();
        window.paymentModule = new PaymentModule();
        
        console.log('✅ All modules initialized successfully');
        loadInitialPage();
    }, 500);
});

function loadInitialPage() {
    try {
        const hash = window.location.hash.replace('#', '');
        const page = hash || 'search';
        navigateToPage(page);
    } catch (e) {
        console.error('Error loading initial page:', e);
    }
}

function navigateToPage(page) {
    console.log('🔄 Navigating to:', page);
    
    try {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.querySelector(`#${page}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('✅ Section shown:', page);
        } else {
            console.warn('⚠️ Section not found:', page);
            const searchSection = document.querySelector('#search-section');
            if (searchSection) searchSection.classList.add('active');
        }
        
        window.location.hash = page;
        window.dispatchEvent(new CustomEvent('pageChange', { detail: { page } }));
        
        if (page === 'my-bookings' && window.flightsModule) {
            setTimeout(() => {
                try {
                    window.flightsModule.displayMyBookings();
                } catch (e) {
                    console.error('Error displaying bookings:', e);
                }
            }, 100);
        }
    } catch (e) {
        console.error('Error navigating:', e);
    }
}

window.addEventListener('hashchange', function() {
    const page = window.location.hash.replace('#', '') || 'search';
    navigateToPage(page);
});

if (window.location.hash) {
    const page = window.location.hash.replace('#', '');
    setTimeout(() => navigateToPage(page), 200);
}

window.navigateToPage = navigateToPage;

console.log('✅ App loaded successfully');