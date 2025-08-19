// API handling for Diagrammaton

// Test API connection
async function testApi() {
    const apiKey = document.getElementById('apiKey').value.trim();
    if (!apiKey) {
        showNotification(getCurrentTranslation('apiKeyMissing'), 'error');
        return;
    }

    showProgress(getCurrentTranslation('testingApiText'));

    try {
        const response = await callOpenRouterAPI('Test message', 'system', 'Respond with "OK"');
        if (response && response.trim().toLowerCase().includes('ok')) {
            showNotification(getCurrentTranslation('apiTestSuccess'), 'success');
        } else {
            showNotification(getCurrentTranslation('apiTestFailed'), 'error');
        }
    } catch (error) {
        console.error('API test error:', error);
        showNotification(getCurrentTranslation('apiTestFailed'), 'error');
    } finally {
        hideProgress();
    }
}

// Call OpenRouter API
async function callOpenRouterAPI(userMessage, systemMessage = '', expectedFormat = '') {
    const apiKey = document.getElementById('apiKey').value.trim();
    const model = document.getElementById('model').value.trim();
    const temperature = parseFloat(document.getElementById('temperature').value);

    const messages = [];
    if (systemMessage) {
        messages.push({ role: 'system', content: systemMessage });
    }
    messages.push({ role: 'user', content: userMessage });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.href,
            'X-Title': 'Diagrammaton'
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: temperature
        })
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response format');
    }
    
    return data.choices[0].message.content;
}

// Generate diagram from description
async function generateDiagram() {
    const description = document.getElementById('processDescription').value.trim();
    if (!description) {
        showNotification('Please enter a process description.', 'error');
        return;
    }

    showProgress(getCurrentTranslation('generatingText'));

    try {
        const systemPrompt = `You are an AI that models user-described processes into a strict JSON format.
- Step IDs must be S1, S2, etc.
- Conditions for branching must be simple logical expressions on output variables, e.g., "status == 'approved'".
- Steps can request user input via 'awaits_user_input: true' and 'user_input_prompt'. Such a step must have exactly one input token, which will receive the user's text.
- Return ONLY the JSON object.
Schema:
{
  "title": string,
  "steps": [{
    "id": "S1", "name": "...", "description": "...",
    "awaits_user_input": boolean?, "user_input_prompt": string?,
    "inputs": ["token_from_another_step_output"], "outputs": ["output_token"],
    "shared": ["token_to_write_to_shared_memory"], "reads": ["token_to_read_from_shared_memory"]
  }],
  "links": [{"from": "S1", "to": "S2", "condition": "output_token == 'value'"?}]
}`;

        const response = await callOpenRouterAPI(description, systemPrompt);
        
        // Parse JSON response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }

        const jsonData = JSON.parse(jsonMatch[0]);
        
        // Validate JSON structure
        if (!jsonData.title || !jsonData.steps || !Array.isArray(jsonData.steps) || !jsonData.links || !Array.isArray(jsonData.links)) {
            throw new Error('Invalid JSON structure');
        }

        currentJson = jsonData;
        
        renderDiagram();
        renderStructuredText();
        
        document.getElementById('editSection').style.display = 'block';
        document.getElementById('diagramSection').style.display = 'block';
        
        updateButtonStates();
        showNotification(getCurrentTranslation('diagramGenerated'), 'success');
        
    } catch (error) {
        console.error('Generate diagram error:', error);
        showNotification(getCurrentTranslation('errorOccurred') + error.message, 'error');
    } finally {
        hideProgress();
    }
}

// Apply changes to existing diagram
async function applyChanges() {
    const editInstructions = document.getElementById('editInstructions').value.trim();
    if (!editInstructions) {
        showNotification('Please enter edit instructions.', 'error');
        return;
    }

    if (!currentJson) {
        showNotification(getCurrentTranslation('noDiagramGenerated'), 'error');
        return;
    }

    showProgress(getCurrentTranslation('applyingChangesText'));

    try {
        const systemPrompt = `You are an AI that modifies process diagrams based on user instructions. You will receive the current JSON and modification instructions. Return ONLY the updated JSON object following the same schema.`;
        
        const userMessage = `Current JSON: ${JSON.stringify(currentJson, null, 2)}\n\nModification instructions: ${editInstructions}`;
        
        const response = await callOpenRouterAPI(userMessage, systemPrompt);
        
        // Parse JSON response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }

        const jsonData = JSON.parse(jsonMatch[0]);
        
        // Validate JSON structure
        if (!jsonData.title || !jsonData.steps || !Array.isArray(jsonData.steps) || !jsonData.links || !Array.isArray(jsonData.links)) {
            throw new Error('Invalid JSON structure');
        }

        currentJson = jsonData;
        
        renderDiagram();
        renderStructuredText();
        
        document.getElementById('editInstructions').value = '';
        showNotification(getCurrentTranslation('changesApplied'), 'success');
        
    } catch (error) {
        console.error('Apply changes error:', error);
        showNotification(getCurrentTranslation('errorOccurred') + error.message, 'error');
    } finally {
        hideProgress();
    }
}

// Generate example value for a token
async function generateTokenExample(token, stepId) {
    const step = currentJson.steps.find(s => s.id === stepId);
    if (!step) return;

    showProgress('Generating example...');

    try {
        const systemPrompt = 'You are an AI that generates realistic example values for process tokens. Respond with only the example value, no explanation.';
        const userMessage = `Generate a realistic example value for token "${token}" in the context of step "${step.name}: ${step.description}"`;
        
        const response = await callOpenRouterAPI(userMessage, systemPrompt);
        
        const tokenField = document.getElementById(`token-${token}`);
        if (tokenField) {
            tokenField.value = response.trim();
        }
        
    } catch (error) {
        console.error('Generate token example error:', error);
        showNotification(getCurrentTranslation('errorOccurred') + error.message, 'error');
    } finally {
        hideProgress();
    }
}