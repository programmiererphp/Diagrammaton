// UI handling and utilities for Diagrammaton

// Show progress overlay
function showProgress(text) {
    document.getElementById('progressText').textContent = text;
    document.getElementById('progressOverlay').classList.remove('hidden');
}

// Hide progress overlay
function hideProgress() {
    document.getElementById('progressOverlay').classList.add('hidden');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
    // Set notification style based on type
    switch (type) {
        case 'success':
            notification.className += ' bg-green-500 text-white';
            break;
        case 'error':
            notification.className += ' bg-red-500 text-white';
            break;
        case 'warning':
            notification.className += ' bg-yellow-500 text-black';
            break;
        default:
            notification.className += ' bg-blue-500 text-white';
    }
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Update button states based on current application state
function updateButtonStates() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const hasApiKey = apiKey.length > 0;
    const hasDiagram = currentJson !== null;

    // Buttons that require API key
    const apiButtons = ['generateBtn', 'testApiBtn'];
    apiButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = !hasApiKey;
            if (!hasApiKey) {
                btn.title = getCurrentTranslation('apiKeyMissing');
            } else {
                btn.title = '';
            }
        }
    });

    // Buttons that require both API key and diagram
    const diagramButtons = ['applyChangesBtn', 'simulateBtn'];
    diagramButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = !hasApiKey || !hasDiagram;
            if (!hasApiKey) {
                btn.title = getCurrentTranslation('apiKeyMissing');
            } else if (!hasDiagram) {
                btn.title = getCurrentTranslation('noDiagramGenerated');
            } else {
                btn.title = '';
            }
        }
    });

    // Buttons that require diagram only
    const diagramOnlyButtons = ['copyMermaidBtn', 'downloadPngBtn', 'exportJsonBtn', 'exportXmlBtn'];
    diagramOnlyButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = !hasDiagram;
            if (!hasDiagram) {
                btn.title = getCurrentTranslation('noDiagramGenerated');
            } else {
                btn.title = '';
            }
        }
    });

    // History buttons
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.disabled = historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = historyIndex >= history.length - 1;
}

// Setup event listeners
function setupEventListeners() {
    // Language change
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            saveSettings();
            updateLanguage();
        });
    }

    // API key change
    const apiKey = document.getElementById('apiKey');
    if (apiKey) {
        apiKey.addEventListener('input', function() {
            saveSettings();
            updateButtonStates();
        });
    }

    // Model and temperature changes
    const model = document.getElementById('model');
    const temperature = document.getElementById('temperature');
    if (model) model.addEventListener('input', saveSettings);
    if (temperature) temperature.addEventListener('input', saveSettings);

    // Process description change
    const processDescription = document.getElementById('processDescription');
    if (processDescription) {
        processDescription.addEventListener('input', function() {
            // Debounce history saving
            clearTimeout(this.historyTimeout);
            this.historyTimeout = setTimeout(() => {
                saveToHistory();
            }, 1000);
        });
    }

    // Tooltip handling
    document.addEventListener('mouseover', handleTooltip);
    document.addEventListener('mouseout', hideTooltip);

    // Modal click outside to close
    document.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl+Z for undo
        if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
            event.preventDefault();
            undo();
        }
        // Ctrl+Shift+Z or Ctrl+Y for redo
        if ((event.ctrlKey && event.shiftKey && event.key === 'Z') || (event.ctrlKey && event.key === 'y')) {
            event.preventDefault();
            redo();
        }
        // Escape to close modals
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal:not(.hidden)');
            openModals.forEach(modal => {
                modal.classList.add('hidden');
            });
        }
    });
}

// Handle tooltip display
function handleTooltip(event) {
    const target = event.target;
    if (target.disabled && target.title) {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.textContent = target.title;
            tooltip.style.left = event.pageX + 10 + 'px';
            tooltip.style.top = event.pageY + 10 + 'px';
            tooltip.classList.remove('opacity-0');
            tooltip.classList.add('opacity-100');
        }
    }
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.classList.remove('opacity-100');
        tooltip.classList.add('opacity-0');
    }
}

// Show info modal
function showInfoModal(section) {
    const lang = document.getElementById('languageSelect')?.value || 'en';
    const translations = I18N[lang];
    
    let content = '';
    switch (section) {
        case 'config':
            content = translations.infoConfig;
            break;
        case 'examples':
            content = translations.infoExamples;
            break;
        case 'description':
            content = translations.infoDescription;
            break;
        case 'edit':
            content = translations.infoEdit;
            break;
        case 'diagram':
            content = translations.infoDiagram;
            break;
        case 'simulationLog':
            content = translations.infoSimulationLog;
            break;
        case 'importExport':
            content = translations.infoImportExport;
            break;
        default:
            content = 'Information not available.';
    }

    document.getElementById('infoModalContent').innerHTML = `<p class="text-gray-700">${content}</p>`;
    document.getElementById('infoModal').classList.remove('hidden');
}

// Close info modal
function closeInfoModal() {
    document.getElementById('infoModal').classList.add('hidden');
}

// Initialize responsive behavior
function initializeResponsive() {
    // Handle window resize
    window.addEventListener('resize', function() {
        // Re-render diagram if it exists to ensure proper sizing
        if (currentJson) {
            setTimeout(() => {
                renderDiagram();
            }, 100);
        }
    });

    // Handle mobile menu behavior
    const handleMobileLayout = () => {
        const isMobile = window.innerWidth < 768;
        
        // Adjust modal sizes for mobile
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(modal => {
            if (isMobile) {
                modal.classList.add('mx-2', 'my-4');
                modal.classList.remove('m-4');
            } else {
                modal.classList.remove('mx-2', 'my-4');
                modal.classList.add('m-4');
            }
        });
    };

    // Initial check
    handleMobileLayout();
    
    // Listen for resize
    window.addEventListener('resize', handleMobileLayout);
}

// Initialize tooltips for better UX
function initializeTooltips() {
    // Add tooltips to disabled buttons
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                updateButtonStates();
            }
        });
    });

    // Observe all buttons for disabled state changes
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        observer.observe(button, { attributes: true });
    });
}

// Initialize accessibility features
function initializeAccessibility() {
    // Add ARIA labels to important elements
    const apiKeyInput = document.getElementById('apiKey');
    if (apiKeyInput) {
        apiKeyInput.setAttribute('aria-describedby', 'api-key-help');
    }

    // Add focus management for modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('keydown', function(event) {
            if (event.key === 'Tab') {
                // Trap focus within modal
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    });
}

// Utility function to debounce function calls
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