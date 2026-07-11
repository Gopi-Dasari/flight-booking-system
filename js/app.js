document.addEventListener('DOMContentLoaded', async function() {
    console.log('✈️ SkyTicket Application Starting...');
    
    try {
        const isLocalFile = window.location.protocol === 'file:';
        if (isLocalFile) {
            console.warn('⚠️ Running on file:// protocol. For best experience, use a local server.');
        }
        
        await loadComponent('header-container', 'templates/header.html');
        await loadComponent('modal-container', 'templates/login-modal.html');
        await loadComponent('modal-container', 'templates/signup-modal.html', true);
        await loadComponent('footer-container', 'templates/footer.html');
        
        setTimeout(() => {
            initializeModules();
        }, 200);
        
        console.log('✅ Application Loaded Successfully!');
    } catch (error) {
        console.error('❌ Error loading application:', error);
    }
});

async function loadComponent(containerId, templatePath, append = false) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found`);
        return;
    }
    
    try {
        console.log(`📥 Loading: ${templatePath}`);
        const response = await fetch(templatePath);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        
        if (!html || html.trim() === '') {
            throw new Error('Template is empty');
        }
        
        if (append) {
            container.innerHTML += html;
        } else {
            container.innerHTML = html;
        }
        
        console.log(`✅ Loaded: ${templatePath}`);
    } catch (error) {
        console.error(`❌ Error loading ${templatePath}:`, error);
        
        const isLocalFile = window.location.protocol === 'file:';
        let fallbackHtml = `
            <div style="padding: 1rem; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; margin: 10px 0; text-align: center;">
                <i class="fas fa-exclamation-triangle" style="color: #856404; font-size: 1.5rem;"></i>
                <h4 style="color: #856404; margin: 10px 0;">Failed to load component</h4>
                <p style="color: #856404; margin: 5px 0;">File: ${templatePath}</p>
        `;
        
        if (isLocalFile) {
            fallbackHtml += `
                <p style="color: #856404; margin: 10px 0; background: #fff; padding: 10px; border-radius: 4px;">
                    <strong>💡 Tip:</strong> You're running on <code>file://</code> protocol.<br>
                    Please use a local server:<br>
                    <code>npx serve</code> or <code>python -m http.server</code>
                </p>
            `;
        }
        
        fallbackHtml += `
                <p style="color: #856404; font-size: 0.875rem; margin-top: 10px;">
                    <a href="#" onclick="location.reload()" style="color: #0066cc; text-decoration: underline;">
                        <i class="fas fa-sync"></i> Try Again
                    </a>
                </p>
            </div>
        `;
        
        if (append) {
            container.innerHTML += fallbackHtml;
        } else {
            container.innerHTML = fallbackHtml;
        }
    }
}

function initializeModules() {
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