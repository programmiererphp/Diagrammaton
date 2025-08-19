// Diagram rendering and handling for Diagrammaton

// Render Mermaid diagram
function renderDiagram() {
    if (!currentJson) return;

    let mermaidCode = 'flowchart TD\n';
    
    // Add nodes
    currentJson.steps.forEach(step => {
        const nodeLabel = `${step.id}: ${step.name}`;
        mermaidCode += `    ${step.id}["${nodeLabel}"]\n`;
    });

    // Add links
    currentJson.links.forEach(link => {
        if (link.condition) {
            mermaidCode += `    ${link.from} -->|"${link.condition}"| ${link.to}\n`;
        } else {
            mermaidCode += `    ${link.from} --> ${link.to}\n`;
        }
    });

    // Add click events
    currentJson.steps.forEach(step => {
        mermaidCode += `    click ${step.id} showStepDetails\n`;
    });

    const diagramElement = document.getElementById('mermaidDiagram');
    diagramElement.innerHTML = '';
    
    // Generate unique ID for this diagram
    const diagramId = 'mermaid-diagram-' + Date.now();
    
    mermaid.render(diagramId, mermaidCode).then(result => {
        diagramElement.innerHTML = result.svg;
        
        // Add click handlers to nodes
        currentJson.steps.forEach(step => {
            const nodeElements = diagramElement.querySelectorAll(`[id*="${step.id}"]`);
            nodeElements.forEach(nodeElement => {
                nodeElement.style.cursor = 'pointer';
                nodeElement.addEventListener('click', () => showStepDetails(step.id));
            });
        });
    }).catch(error => {
        console.error('Mermaid rendering error:', error);
        diagramElement.innerHTML = '<p class="text-red-600">Error rendering diagram. Please check the generated JSON.</p>';
    });
}

// Render structured text view
function renderStructuredText() {
    if (!currentJson) return;

    let text = `Title: ${currentJson.title}\n\n`;
    text += 'Steps:\n';
    
    currentJson.steps.forEach(step => {
        text += `  ${step.id}: ${step.name}\n`;
        text += `    Description: ${step.description}\n`;
        if (step.inputs && step.inputs.length > 0) {
            text += `    Inputs: ${step.inputs.join(', ')}\n`;
        }
        if (step.outputs && step.outputs.length > 0) {
            text += `    Outputs: ${step.outputs.join(', ')}\n`;
        }
        if (step.shared && step.shared.length > 0) {
            text += `    Shared: ${step.shared.join(', ')}\n`;
        }
        if (step.reads && step.reads.length > 0) {
            text += `    Reads: ${step.reads.join(', ')}\n`;
        }
        if (step.awaits_user_input) {
            text += `    Awaits User Input: ${step.user_input_prompt || 'Yes'}\n`;
        }
        text += '\n';
    });

    text += 'Links:\n';
    currentJson.links.forEach(link => {
        if (link.condition) {
            text += `  ${link.from} -> ${link.to} (${link.condition})\n`;
        } else {
            text += `  ${link.from} -> ${link.to}\n`;
        }
    });

    document.getElementById('structuredText').textContent = text;
}

// Show step details modal
function showStepDetails(stepId) {
    const step = currentJson.steps.find(s => s.id === stepId);
    if (!step) return;

    let content = `<h4 class="font-semibold mb-2">${step.id}: ${step.name}</h4>`;
    content += `<p class="mb-4">${step.description}</p>`;

    const tokenTypes = [
        { key: 'inputs', label: getCurrentTranslation('inputsLabel') },
        { key: 'outputs', label: getCurrentTranslation('outputsLabel') },
        { key: 'shared', label: getCurrentTranslation('sharedMemoryWritesLabel') },
        { key: 'reads', label: getCurrentTranslation('sharedMemoryReadsLabel') }
    ];

    tokenTypes.forEach(type => {
        if (step[type.key] && step[type.key].length > 0) {
            content += `<div class="mb-4">`;
            content += `<h5 class="font-medium mb-2">${type.label}</h5>`;
            step[type.key].forEach(token => {
                content += `<div class="flex items-center space-x-2 mb-2">`;
                content += `<span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">${token}</span>`;
                content += `<textarea class="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" placeholder="${getCurrentTranslation('exampleValuePlaceholder')}" id="token-${token}"></textarea>`;
                content += `<button class="btn btn-secondary text-xs" onclick="generateTokenExample('${token}', '${step.id}')">${getCurrentTranslation('generateExampleText')}</button>`;
                content += `</div>`;
            });
            content += `</div>`;
        }
    });

    if (step.awaits_user_input) {
        content += `<div class="mb-4">`;
        content += `<h5 class="font-medium mb-2">${getCurrentTranslation('userInputRequiredLabel')}</h5>`;
        content += `<p class="text-sm text-gray-600">${step.user_input_prompt || 'This step requires user input'}</p>`;
        content += `</div>`;
    }

    document.getElementById('stepModalContent').innerHTML = content;
    document.getElementById('stepModal').classList.remove('hidden');
}

// Close step details modal
function closeStepModal() {
    document.getElementById('stepModal').classList.add('hidden');
}

// Copy Mermaid code to clipboard
function copyMermaidCode() {
    if (!currentJson) return;

    let mermaidCode = 'flowchart TD\n';
    
    currentJson.steps.forEach(step => {
        const nodeLabel = `${step.id}: ${step.name}`;
        mermaidCode += `    ${step.id}["${nodeLabel}"]\n`;
    });

    currentJson.links.forEach(link => {
        if (link.condition) {
            mermaidCode += `    ${link.from} -->|"${link.condition}"| ${link.to}\n`;
        } else {
            mermaidCode += `    ${link.from} --> ${link.to}\n`;
        }
    });

    navigator.clipboard.writeText(mermaidCode).then(() => {
        showNotification(getCurrentTranslation('mermaidCodeCopied'), 'success');
    }).catch(error => {
        console.error('Copy to clipboard failed:', error);
        // Fallback: create a temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = mermaidCode;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification(getCurrentTranslation('mermaidCodeCopied'), 'success');
    });
}

// Download diagram as PNG
function downloadPng() {
    const svgElement = document.querySelector('#mermaidDiagram svg');
    if (!svgElement) return;

    try {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Get SVG dimensions
        const svgRect = svgElement.getBoundingClientRect();
        canvas.width = svgRect.width;
        canvas.height = svgRect.height;
        
        // Create an image from SVG
        const img = new Image();
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = function() {
            // Draw image on canvas
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            // Convert canvas to blob and download
            canvas.toBlob(function(blob) {
                const link = document.createElement('a');
                link.download = 'diagrammaton-diagram.png';
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(url);
                URL.revokeObjectURL(link.href);
            }, 'image/png');
        };

        img.onerror = function() {
            console.error('Failed to load SVG for PNG conversion');
            showNotification('Failed to download PNG. Please try copying the Mermaid code instead.', 'error');
            URL.revokeObjectURL(url);
        };

        img.src = url;
    } catch (error) {
        console.error('PNG download error:', error);
        showNotification('Failed to download PNG. Please try copying the Mermaid code instead.', 'error');
    }
}

// Global function for Mermaid click events (needed for mermaid click handlers)
window.showStepDetails = showStepDetails;