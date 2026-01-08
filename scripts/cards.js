/**
 * Card interactions for STAR Method Flashcards
 * Handles flip animations and card behaviors
 */

/**
 * Initialize flip cards with click and keyboard handlers
 * @param {HTMLElement} container - Optional container to search within
 */
function initFlipCards(container) {
    const root = container || document;
    const cards = root.querySelectorAll('.card:not(.practice-card)');

    cards.forEach(card => {
        // Skip if already initialized
        if (card.dataset.flipInitialized) return;
        card.dataset.flipInitialized = 'true';

        // Add click handler for flip effect
        card.addEventListener('click', function (e) {
            // Don't flip if clicking on a link, button, or input
            if (e.target.tagName === 'A' ||
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'INPUT' ||
                e.target.tagName === 'TEXTAREA') {
                return;
            }

            toggleFlip(this);
        });

        // Add keyboard support
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
        if (!card.hasAttribute('role')) {
            card.setAttribute('role', 'button');
        }
        if (!card.hasAttribute('aria-label')) {
            card.setAttribute('aria-label', 'Click to flip card');
        }

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFlip(this);
            }
        });
    });
}

/**
 * Toggle flip state of a card
 * @param {HTMLElement} card - Card element to flip
 */
function toggleFlip(card) {
    card.classList.toggle('flipped');

    // Update aria-expanded state
    const isFlipped = card.classList.contains('flipped');
    card.setAttribute('aria-expanded', isFlipped);
}

/**
 * Flip all cards in a container
 * @param {boolean} flipped - True to flip all, false to unflip all
 */
function flipAllCards(flipped) {
    const cards = document.querySelectorAll('.card:not(.practice-card)');

    cards.forEach(card => {
        if (flipped) {
            card.classList.add('flipped');
        } else {
            card.classList.remove('flipped');
        }
        card.setAttribute('aria-expanded', flipped);
    });
}

// Initialize cards when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Small delay to ensure components are loaded
    setTimeout(() => {
        initFlipCards();
    }, 100);
});

// Re-initialize when new content is loaded (for dynamic tabs)
document.addEventListener('contentLoaded', function (e) {
    if (e.detail && e.detail.container) {
        initFlipCards(e.detail.container);
    }
});
