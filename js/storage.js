// Storage and import/export functionality for Diagrammaton

// Global state for history management
let history = [];
let historyIndex = -1;

// Load settings from localStorage
function loadSettings() {
    const apiKey = localStorage.getItem('diagrammaton_api_key');
    const model = localStorage.getItem('diagrammaton_model');
    const temperature = localStorage.getItem('diagrammaton_temperature');
    const language = localStorage.getItem('diagrammaton_language');

    if (apiKey) document.getElementById('apiKey').value = apiKey;
    if (model) document.getElementById('model').value = model;
    if (temperature) document.getElementById('temperature').value = temperature;
    if (language) {
        document.getElementById('languageSelect').value = language;
        document.documentElement.lang = language;
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('diagrammaton_api_key', document.getElementById('apiKey').value);
    localStorage.setItem('diagrammaton_model', document.getElementById('model').value);
    localStorage.setItem('diagrammaton_temperature', document.getElementById('temperature').value);
    localStorage.setItem('diagrammaton_language', document.getElementById('languageSelect').value);
}

// Save current state to history
function saveToHistory() {
    const state = {
        description: document.getElementById('processDescription').value,
        json: currentJson ? JSON.parse(JSON.stringify(currentJson)) : null,
        timestamp: Date.now()
    };

    // Remove future history if we're not at the end
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }

    history.push(state);
    historyIndex = history.length - 1;

    // Limit history size
    if (history.length > 50) {
        history.shift();
        historyIndex--;
    }

    updateButtonStates();
}

// Undo last action
function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        const state = history[historyIndex];
        restoreState(state);
    }
}

// Redo last undone action
function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        const state = history[historyIndex];
        restoreState(state);
    }
}

// Restore state from history
function restoreState(state) {
    document.getElementById('processDescription').value = state.description;
    currentJson = state.json;
    
    if (currentJson) {
        renderDiagram();
        renderStructuredText();
        document.getElementById('editSection').style.display = 'block';
        document.getElementById('diagramSection').style.display = 'block';
    } else {
        document.getElementById('editSection').style.display = 'none';
        document.getElementById('diagramSection').style.display = 'none';
    }
    
    updateButtonStates();
}

// Reset all data
function resetAll() {
    if (confirm(getCurrentTranslation('resetConfirmation'))) {
        document.getElementById('processDescription').value = '';
        document.getElementById('editInstructions').value = '';
        currentJson = null;
        simulationState = null;
        simulationLog = [];
        runCounter = 1;
        history = [];
        historyIndex = -1;
        
        document.getElementById('editSection').style.display = 'none';
        document.getElementById('diagramSection').style.display = 'none';
        document.getElementById('simulationLogSection').style.display = 'none';
        document.getElementById('simulationLogBody').innerHTML = '';
        document.getElementById('mermaidDiagram').innerHTML = '';
        document.getElementById('structuredText').textContent = '';
        
        updateButtonStates();
        saveToHistory();
    }
}

// Export current state as JSON
function exportJson() {
    if (!currentJson) {
        showNotification(getCurrentTranslation('noDiagramGenerated'), 'error');
        return;
    }

    const exportData = {
        version: '1.0',
        description: document.getElementById('processDescription').value,
        diagram: currentJson,
        simulationLog: simulationLog,
        timestamp: new Date().toISOString(),
        language: document.getElementById('languageSelect').value
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'diagrammaton-export.json';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
}

// Export current state as XML
function exportXml() {
    if (!currentJson) {
        showNotification(getCurrentTranslation('noDiagramGenerated'), 'error');
        return;
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<diagrammaton version="1.0">\n';
    xml += `  <timestamp>${new Date().toISOString()}</timestamp>\n`;
    xml += `  <language>${document.getElementById('languageSelect').value}</language>\n`;
    xml += `  <description><![CDATA[${document.getElementById('processDescription').value}]]></description>\n`;
    xml += `  <title><![CDATA[${currentJson.title}]]></title>\n`;
    xml += '  <steps>\n';
    
    currentJson.steps.forEach(step => {
        xml += `    <step id="${step.id}">\n`;
        xml += `      <name><![CDATA[${step.name}]]></name>\n`;
        xml += `      <description><![CDATA[${step.description}]]></description>\n`;
        if (step.inputs && step.inputs.length > 0) {
            xml += `      <inputs>${step.inputs.join(',')}</inputs>\n`;
        }
        if (step.outputs && step.outputs.length > 0) {
            xml += `      <outputs>${step.outputs.join(',')}</outputs>\n`;
        }
        if (step.shared && step.shared.length > 0) {
            xml += `      <shared>${step.shared.join(',')}</shared>\n`;
        }
        if (step.reads && step.reads.length > 0) {
            xml += `      <reads>${step.reads.join(',')}</reads>\n`;
        }
        if (step.awaits_user_input) {
            xml += `      <awaits_user_input>${step.awaits_user_input}</awaits_user_input>\n`;
        }
        if (step.user_input_prompt) {
            xml += `      <user_input_prompt><![CDATA[${step.user_input_prompt}]]></user_input_prompt>\n`;
        }
        xml += '    </step>\n';
    });
    
    xml += '  </steps>\n';
    xml += '  <links>\n';
    
    currentJson.links.forEach(link => {
        xml += `    <link from="${link.from}" to="${link.to}"`;
        if (link.condition) {
            xml += ` condition="${escapeXml(link.condition)}"`;
        }
        xml += '/>\n';
    });
    
    xml += '  </links>\n';
    
    if (simulationLog.length > 0) {
        xml += '  <simulation_log>\n';
        simulationLog.forEach(entry => {
            xml += '    <entry>\n';
            xml += `      <run>${entry.run}</run>\n`;
            xml += `      <step><![CDATA[${entry.stepName}]]></step>\n`;
            xml += `      <condition><![CDATA[${entry.condition}]]></condition>\n`;
            xml += `      <inputs><![CDATA[${entry.inputs}]]></inputs>\n`;
            xml += `      <outputs><![CDATA[${entry.outputs}]]></outputs>\n`;
            xml += '    </entry>\n';
        });
        xml += '  </simulation_log>\n';
    }
    
    xml += '</diagrammaton>\n';

    const blob = new Blob([xml], { type: 'application/xml' });
    const link = document.createElement('a');
    link.download = 'diagrammaton-export.xml';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
}

// Import file
function importFile() {
    const file = document.getElementById('importFile').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.name.endsWith('.json')) {
                data = JSON.parse(e.target.result);
                
                // Validate JSON structure
                if (data.description !== undefined) {
                    document.getElementById('processDescription').value = data.description;
                }
                
                if (data.language) {
                    document.getElementById('languageSelect').value = data.language;
                    updateLanguage();
                }
                
                if (data.diagram) {
                    currentJson = data.diagram;
                    renderDiagram();
                    renderStructuredText();
                    document.getElementById('editSection').style.display = 'block';
                    document.getElementById('diagramSection').style.display = 'block';
                }
                
                if (data.simulationLog && Array.isArray(data.simulationLog)) {
                    simulationLog = data.simulationLog;
                    
                    // Rebuild simulation log table
                    const tbody = document.getElementById('simulationLogBody');
                    tbody.innerHTML = '';
                    simulationLog.forEach(entry => {
                        const row = tbody.insertRow();
                        row.insertCell(0).textContent = entry.run;
                        row.insertCell(1).textContent = entry.stepName;
                        row.insertCell(2).textContent = entry.condition;
                        row.insertCell(3).textContent = entry.inputs;
                        row.insertCell(4).textContent = entry.outputs;
                    });
                    
                    if (simulationLog.length > 0) {
                        document.getElementById('simulationLogSection').style.display = 'block';
                        runCounter = Math.max(...simulationLog.map(entry => entry.run)) + 1;
                    }
                }
                
                updateButtonStates();
                
            } else if (file.name.endsWith('.xml')) {
                // Basic XML parsing
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, 'text/xml');
                
                // Check for parsing errors
                const parseError = xmlDoc.querySelector('parsererror');
                if (parseError) {
                    throw new Error('Invalid XML format');
                }
                
                const description = xmlDoc.querySelector('description')?.textContent || '';
                document.getElementById('processDescription').value = description;
                
                const language = xmlDoc.querySelector('language')?.textContent;
                if (language) {
                    document.getElementById('languageSelect').value = language;
                    updateLanguage();
                }
                
                // This is a simplified XML import - full implementation would parse the XML structure
                showNotification(getCurrentTranslation('xmlImportSimplified'), 'info');
            }
            
            saveToHistory();
            showNotification(getCurrentTranslation('fileImportedSuccess'), 'success');
            
        } catch (error) {
            console.error('Import error:', error);
            showNotification(getCurrentTranslation('fileImportError') + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    document.getElementById('importFile').value = '';
}

// Utility function to escape XML special characters
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}