/**
 * Main app functionality for STAR Method Flashcards
 * Handles theme toggling, initialization, and global features
 */

/**
 * Initialize theme from localStorage or system preference
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set theme based on saved preference or system preference
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(theme);

    // Set up theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Set the theme and update UI
 * @param {string} theme - 'dark' or 'light'
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update toggle button icon
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Save preference
    localStorage.setItem('theme', theme);
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // Add animation feedback
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 200);
    }
}

/**
 * Initialize flip cards in a container
 * @param {HTMLElement} container - Container element to search for cards
 */
function initFlipCards(container) {
    if (!container) return;

    const cards = container.querySelectorAll('.card:not(.practice-card)');

    cards.forEach(card => {
        // Skip if already has flip functionality
        if (card.closest('.flip-card')) return;

        // Add click handler for flip effect
        card.addEventListener('click', function (e) {
            // Don't flip if clicking on a link or button
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

            this.classList.toggle('flipped');
        });

        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Click to flip card');

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('flipped');
            }
        });
    });
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background: var(--card-bg);
        border: 1px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : 'accent-primary'});
        border-radius: var(--radius-lg);
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 40px var(--card-shadow);
        backdrop-filter: blur(20px);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations to document
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(toastStyles);

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Log helpful message for file:// protocol users
if (window.location.protocol === 'file:') {
    console.warn(
        '%c⚠️ STAR Method Flashcards',
        'font-size: 16px; font-weight: bold; color: #f59e0b;'
    );
    console.warn(
        'This app works best when served from a local server.\n' +
        'Run: npx serve\n' +
        'Then open: http://localhost:3000'
    );
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
