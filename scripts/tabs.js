/**
 * Tab functionality for STAR Method Flashcards
 * Handles tab switching, keyboard navigation, and progress updates
 */

const tabOrder = ['basics', 'components', 'questions', 'tips', 'examples', 'practice'];
let currentTabIndex = 0;

/**
 * Open a specific tab
 * @param {Event} evt - Click event
 * @param {string} tabName - Name of the tab to open
 */
function openTab(evt, tabName) {
    // Update current tab index
    currentTabIndex = tabOrder.indexOf(tabName);

    // Hide all tab content
    const tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active");
    }

    // Remove active class from tab buttons
    const tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
        tabButtons[i].setAttribute('aria-selected', 'false');
    }

    // Show the current tab and add active class to button
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add("active");
    }

    // Update the clicked button or find the correct button
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
        evt.currentTarget.setAttribute('aria-selected', 'true');
    } else {
        const activeButton = document.getElementById('tab-' + tabName);
        if (activeButton) {
            activeButton.classList.add("active");
            activeButton.setAttribute('aria-selected', 'true');
        }
    }

    // Update progress bar
    updateProgressBar();

    // Update navigation buttons
    updateNavButtons();

    // Update URL hash
    window.history.replaceState(null, null, '#' + tabName);

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Navigate between tabs using Previous/Next buttons
 * @param {number} direction - 1 for next, -1 for previous
 */
function navigateTabs(direction) {
    const newIndex = currentTabIndex + direction;

    if (newIndex >= 0 && newIndex < tabOrder.length) {
        const tabName = tabOrder[newIndex];
        openTab(null, tabName);
    }
}

/**
 * Update the progress bar based on current tab
 */
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = ((currentTabIndex + 1) / tabOrder.length) * 100;
        progressBar.style.width = progress + '%';

        // Update aria values
        const container = progressBar.parentElement;
        if (container) {
            container.setAttribute('aria-valuenow', currentTabIndex + 1);
        }
    }
}

/**
 * Update navigation button states
 */
function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.disabled = currentTabIndex === 0;
        if (currentTabIndex === 0) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
    }

    if (nextBtn) {
        nextBtn.disabled = currentTabIndex === tabOrder.length - 1;
        if (currentTabIndex === tabOrder.length - 1) {
            nextBtn.innerHTML = '<i class="fas fa-check"></i> <span>Complete!</span>';
            nextBtn.disabled = true;
        } else {
            nextBtn.innerHTML = '<span>Next</span> <i class="fas fa-arrow-right"></i>';
        }
    }
}

/**
 * Handle keyboard navigation
 */
document.addEventListener('keydown', function (e) {
    // Only handle arrow keys when not focused on input elements
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        navigateTabs(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigateTabs(-1);
    }
});

/**
 * Initialize tab from URL hash on page load
 */
function initTabFromHash() {
    const hash = window.location.hash.slice(1);
    if (hash && tabOrder.includes(hash)) {
        openTab(null, hash);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initTabFromHash();
    updateProgressBar();
    updateNavButtons();
});

// Handle browser back/forward buttons
window.addEventListener('hashchange', function () {
    initTabFromHash();
});
