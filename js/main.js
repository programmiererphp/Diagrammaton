// Main application file for Diagrammaton

// Global application state
let currentJson = null;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    console.log('Initializing Diagrammaton...');
    
    try {
        // Load saved settings from localStorage
        loadSettings();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize Mermaid with configuration
        initializeMermaid();
        
        // Update UI language
        updateLanguage();
        
        // Update button states
        updateButtonStates();
        
        // Initialize responsive behavior
        initializeResponsive();
        
        // Initialize tooltips
        initializeTooltips();
        
        // Initialize accessibility features
        initializeAccessibility();
        
        // Initialize history with empty state
        saveToHistory();
        
        console.log('Diagrammaton initialized successfully');
        
    } catch (error) {
        console.error('Error initializing Diagrammaton:', error);
        showNotification('Error initializing application: ' + error.message, 'error');
    }
}

// Initialize Mermaid diagram library
function initializeMermaid() {
    try {
        mermaid.initialize({ 
            startOnLoad: false,
            theme: 'default',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            },
            themeVariables: {
                primaryColor: '#3B82F6',
                primaryTextColor: '#1F2937',
                primaryBorderColor: '#2563EB',
                lineColor: '#6B7280',
                secondaryColor: '#F3F4F6',
                tertiaryColor: '#E5E7EB'
            },
            securityLevel: 'loose' // Allow click events
        });
        
        console.log('Mermaid initialized successfully');
    } catch (error) {
        console.error('Error initializing Mermaid:', error);
        showNotification('Error initializing diagram engine', 'error');
    }
}

// Application lifecycle management
window.addEventListener('beforeunload', function(event) {
    // Save current state before page unload
    try {
        saveSettings();
    } catch (error) {
        console.error('Error saving settings on page unload:', error);
    }
});

// Handle application errors
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
    showNotification('An unexpected error occurred. Please refresh the page if problems persist.', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('An unexpected error occurred. Please check your network connection.', 'error');
});

// Utility functions for application state management
function getApplicationState() {
    return {
        currentJson: currentJson,
        description: document.getElementById('processDescription')?.value || '',
        editInstructions: document.getElementById('editInstructions')?.value || '',
        simulationState: simulationState,
        simulationLog: simulationLog,
        runCounter: runCounter,
        history: history,
        historyIndex: historyIndex,
        settings: {
            apiKey: document.getElementById('apiKey')?.value || '',
            model: document.getElementById('model')?.value || '',
            temperature: document.getElementById('temperature')?.value || '',
            language: document.getElementById('languageSelect')?.value || 'en'
        }
    };
}

function validateApplicationState() {
    const state = getApplicationState();
    
    // Validate required elements exist
    const requiredElements = [
        'processDescription', 'editInstructions', 'apiKey', 
        'model', 'temperature', 'languageSelect'
    ];
    
    for (const elementId of requiredElements) {
        if (!document.getElementById(elementId)) {
            throw new Error(`Required element ${elementId} not found`);
        }
    }
    
    // Validate JSON structure if present
    if (currentJson) {
        if (!currentJson.title || !Array.isArray(currentJson.steps) || !Array.isArray(currentJson.links)) {
            throw new Error('Invalid JSON structure');
        }
    }
    
    return true;
}

// Debug functions (only available in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.diagrammatonDebug = {
        getState: getApplicationState,
        validateState: validateApplicationState,
        getCurrentJson: () => currentJson,
        getSimulationState: () => simulationState,
        getSimulationLog: () => simulationLog,
        getHistory: () => history,
        clearHistory: () => {
            history = [];
            historyIndex = -1;
            updateButtonStates();
        },
        exportDebugInfo: () => {
            const debugInfo = {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                state: getApplicationState(),
                errors: window.diagrammatonErrors || []
            };
            
            const blob = new Blob([JSON.stringify(debugInfo, null, 2)], { type: 'application/json' });
            const link = document.createElement('a');
            link.download = 'diagrammaton-debug.json';
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        }
    };
    
    // Collect errors for debugging
    window.diagrammatonErrors = [];
    
    const originalConsoleError = console.error;
    console.error = function(...args) {
        window.diagrammatonErrors.push({
            timestamp: new Date().toISOString(),
            message: args.join(' '),
            stack: new Error().stack
        });
        originalConsoleError.apply(console, args);
    };
    
    console.log('Diagrammaton debug mode enabled. Use window.diagrammatonDebug for debugging.');
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`Diagrammaton loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
            }
        }, 0);
    });
}

// Service worker registration for offline support (if available)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export main functions to global scope for HTML onclick handlers
window.testApi = testApi;
window.loadExample = loadExample;
window.generateDiagram = generateDiagram;
window.applyChanges = applyChanges;
window.undo = undo;
window.redo = redo;
window.resetAll = resetAll;
window.copyMermaidCode = copyMermaidCode;
window.downloadPng = downloadPng;
window.startSimulation = startSimulation;
window.executeNextStep = executeNextStep;
window.resetSimulation = resetSimulation;
window.closeSimulationModal = closeSimulationModal;
window.exportJson = exportJson;
window.exportXml = exportXml;
window.importFile = importFile;
window.exportSimulationLog = exportSimulationLog;
window.showStepDetails = showStepDetails;
window.closeStepModal = closeStepModal;
window.showInfoModal = showInfoModal;
window.closeInfoModal = closeInfoModal;
window.generateTokenExample = generateTokenExample;