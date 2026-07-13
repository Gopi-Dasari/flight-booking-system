// Main Application - Loads all components and initializes the app

document.addEventListener('DOMContentLoaded', function() {
    console.log('✈️ SkyTicket Application Starting...');
    console.log('📱 Version: 1.0.0');
    
    // Initialize modules
    window.headerModule = new HeaderModule();
    window.authModule = new AuthModule();
    
    setTimeout(function() {
        window.searchModule = new SearchModule();
        window.flightsModule = new FlightsModule();
        window.bookingModule = new BookingModule();
        window.paymentModule = new PaymentModule();
        
        console.log('✅ Application initialized successfully');
        console.log('📦 Modules loaded:', Object.keys(window).filter(k => k.includes('Module')).join(', '));
        
        // Check if user is logged in
        checkUserStatus();
        
        // Load initial page
        loadInitialPage();
    }, 300);
});

function checkUserStatus() {
    const user = localStorage.getItem('skyTicket_user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            console.log('👤 User logged in:', userData.name);
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    } else {
        console.log('👤 User not logged in');
    }
}

function loadInitialPage() {
    const hash = window.location.hash.replace('#', '');
    const page = hash || 'search';
    navigateToPage(page);
}

function navigateToPage(page) {
    console.log('🔄 Navigating to:', page);
    
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.querySelector(`#${page}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('✅ Section shown:', page);
    } else {
        console.warn('⚠️ Section not found:', page);
        const searchSection = document.querySelector('#search-section');
        if (searchSection) searchSection.classList.add('active');
    }
    
    // Update URL hash
    window.location.hash = page;
    
    // Dispatch event for other modules
    window.dispatchEvent(new CustomEvent('pageChange', { 
        detail: { page } 
    }));
    
    // Special handling for my-bookings
    if (page === 'my-bookings' && window.flightsModule) {
        setTimeout(() => {
            window.flightsModule.displayMyBookings();
        }, 100);
    }
    
    // Special handling for profile
    if (page === 'profile') {
        loadProfile();
    }
}

function loadProfile() {
    const container = document.getElementById('profileContent');
    if (!container) return;
    
    const user = localStorage.getItem('skyTicket_user');
    if (!user) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-user" style="font-size: 3rem; color: var(--gray-400);"></i>
                <h3 style="margin-top: var(--spacing-md);">Please Login</h3>
                <p style="color: var(--gray-600);">Login to view your profile</p>
                <button class="btn-primary" onclick="navigateToPage('search')">
                    <i class="fas fa-search"></i> Go to Search
                </button>
            </div>
        `;
        return;
    }
    
    try {
        const userData = JSON.parse(user);
        const bookings = getBookings ? getBookings() : [];
        
        container.innerHTML = `
            <div class="card" style="max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; padding: var(--spacing-lg);">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; margin: 0 auto;">
                        ${getInitials(userData.name)}
                    </div>
                    <h3 style="margin-top: var(--spacing-md);">${userData.name}</h3>
                    <p style="color: var(--gray-600);">${userData.email}</p>
                    <p style="color: var(--gray-500); font-size: 0.875rem;">Member since: ${new Date(userData.memberSince || Date.now()).toLocaleDateString()}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); padding: var(--spacing-md); border-top: 1px solid var(--gray-200);">
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${bookings.length}</div>
                        <div style="font-size: 0.875rem; color: var(--gray-500);">Total Bookings</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${bookings.filter(b => b.status === 'confirmed').length}</div>
                        <div style="font-size: 0.875rem; color: var(--gray-500);">Active Bookings</div>
                    </div>
                </div>
                
                <div style="padding: var(--spacing-md); border-top: 1px solid var(--gray-200);">
                    <button class="btn-secondary btn-full" onclick="navigateToPage('my-bookings')">
                        <i class="fas fa-ticket-alt"></i> View My Bookings
                    </button>
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Error loading profile:', e);
        container.innerHTML = `<p style="color: var(--danger);">Error loading profile</p>`;
    }
}

// Handle hash changes
window.addEventListener('hashchange', function() {
    const page = window.location.hash.replace('#', '') || 'search';
    navigateToPage(page);
});

// Handle initial hash
if (window.location.hash) {
    const page = window.location.hash.replace('#', '');
    setTimeout(() => navigateToPage(page), 100);
}

// Make functions globally available
window.navigateToPage = navigateToPage;
window.loadProfile = loadProfile;