/**
 * Practice functionality for STAR Method Flashcards
 * Handles saving drafts, timer, and practice interactions
 */

const STORAGE_KEY = 'star-practice-drafts';
let timerInterval = null;
let timerSeconds = 120; // 2 minutes default
let timerRunning = false;

/**
 * Initialize practice features
 */
function initPractice() {
    // Load saved drafts
    loadDrafts();

    // Set up auto-save on input
    const textareas = document.querySelectorAll('#practice textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', debounce(function () {
            saveDrafts();
            showSavedIndicator(this);
            updateCharCount(this);
        }, 500));

        // Initial char count
        updateCharCount(textarea);
    });

    // Set up timer controls
    setupTimer();
}

/**
 * Save all practice drafts to localStorage
 */
function saveDrafts() {
    const drafts = {};
    const textareas = document.querySelectorAll('#practice textarea[data-question]');

    textareas.forEach(textarea => {
        const questionId = textarea.getAttribute('data-question');
        const section = textarea.getAttribute('data-section');

        if (!drafts[questionId]) {
            drafts[questionId] = {};
        }

        drafts[questionId][section] = textarea.value;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

/**
 * Load saved drafts from localStorage
 */
function loadDrafts() {
    const savedDrafts = localStorage.getItem(STORAGE_KEY);

    if (savedDrafts) {
        try {
            const drafts = JSON.parse(savedDrafts);

            Object.keys(drafts).forEach(questionId => {
                Object.keys(drafts[questionId]).forEach(section => {
                    const textarea = document.querySelector(
                        `textarea[data-question="${questionId}"][data-section="${section}"]`
                    );
                    if (textarea) {
                        textarea.value = drafts[questionId][section];
                        updateCharCount(textarea);
                    }
                });
            });
        } catch (e) {
            console.error('Error loading drafts:', e);
        }
    }
}

/**
 * Clear all drafts for a specific question
 * @param {string} questionId - ID of the question to clear
 */
function clearDraft(questionId) {
    const textareas = document.querySelectorAll(`textarea[data-question="${questionId}"]`);
    textareas.forEach(textarea => {
        textarea.value = '';
        updateCharCount(textarea);
    });

    // Update localStorage
    const savedDrafts = localStorage.getItem(STORAGE_KEY);
    if (savedDrafts) {
        try {
            const drafts = JSON.parse(savedDrafts);
            delete drafts[questionId];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
        } catch (e) {
            console.error('Error clearing draft:', e);
        }
    }

    if (typeof showToast === 'function') {
        showToast('Draft cleared', 'info');
    }
}

/**
 * Show saved indicator next to textarea
 * @param {HTMLElement} textarea - The textarea element
 */
function showSavedIndicator(textarea) {
    const indicator = textarea.parentElement.querySelector('.saved-indicator');
    if (indicator) {
        indicator.classList.add('show');
        setTimeout(() => indicator.classList.remove('show'), 2000);
    }
}

/**
 * Update character count for a textarea
 * @param {HTMLElement} textarea - The textarea element
 */
function updateCharCount(textarea) {
    const charCount = textarea.parentElement.querySelector('.char-count');
    if (charCount) {
        const count = textarea.value.length;
        charCount.textContent = `${count} characters`;

        // Change color based on length
        if (count > 500) {
            charCount.style.color = 'var(--warning)';
        } else if (count > 200) {
            charCount.style.color = 'var(--success)';
        } else {
            charCount.style.color = 'var(--text-muted)';
        }
    }
}

/**
 * Set up timer functionality
 */
function setupTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    const startBtn = document.getElementById('timerStart');
    const resetBtn = document.getElementById('timerReset');

    if (startBtn) {
        startBtn.addEventListener('click', toggleTimer);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetTimer);
    }

    // Initialize display
    updateTimerDisplay();
}

/**
 * Toggle timer start/pause
 */
function toggleTimer() {
    const startBtn = document.getElementById('timerStart');

    if (timerRunning) {
        // Pause
        clearInterval(timerInterval);
        timerRunning = false;
        if (startBtn) {
            startBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    } else {
        // Start
        timerRunning = true;
        if (startBtn) {
            startBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }

        timerInterval = setInterval(() => {
            timerSeconds--;

            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                timerSeconds = 0;

                if (startBtn) {
                    startBtn.innerHTML = '<i class="fas fa-play"></i>';
                }

                // Play sound or show notification
                if (typeof showToast === 'function') {
                    showToast('Time\'s up! Great practice session!', 'success');
                }
            }

            updateTimerDisplay();
        }, 1000);
    }
}

/**
 * Reset timer to initial value
 */
function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = 120;

    const startBtn = document.getElementById('timerStart');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    updateTimerDisplay();
}

/**
 * Update timer display
 */
function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Update warning states
        timerDisplay.classList.remove('warning', 'danger');
        if (timerSeconds <= 30) {
            timerDisplay.classList.add('danger');
        } else if (timerSeconds <= 60) {
            timerDisplay.classList.add('warning');
        }
    }
}

/**
 * Export practice answers
 * @param {string} questionId - ID of the question to export
 */
function exportAnswer(questionId) {
    const textareas = document.querySelectorAll(`textarea[data-question="${questionId}"]`);
    let exportText = '';

    textareas.forEach(textarea => {
        const section = textarea.getAttribute('data-section');
        exportText += `**${section.toUpperCase()}:**\n${textarea.value}\n\n`;
    });

    // Copy to clipboard
    navigator.clipboard.writeText(exportText).then(() => {
        if (typeof showToast === 'function') {
            showToast('Answer copied to clipboard!', 'success');
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Debounce helper if not already defined
if (typeof debounce === 'undefined') {
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
}
