// Simulation engine for Diagrammaton

// Global simulation state
let simulationState = null;
let simulationLog = [];
let runCounter = 1;

// Start simulation
function startSimulation() {
    if (!currentJson) {
        showNotification(getCurrentTranslation('noDiagramGenerated'), 'error');
        return;
    }

    // Initialize simulation state
    simulationState = {
        currentStepId: currentJson.steps[0].id,
        sharedMemory: {},
        stepOutputs: {},
        isComplete: false
    };

    updateSimulationModal();
    document.getElementById('simulationModal').classList.remove('hidden');
    document.getElementById('simulationLogSection').style.display = 'block';
}

// Update simulation modal content
function updateSimulationModal() {
    if (!simulationState || simulationState.isComplete) {
        document.getElementById('currentStepInfo').innerHTML = `<p class="text-green-600">${getCurrentTranslation('simulationCompleteMessage')}</p>`;
        document.getElementById('nextStepBtn').disabled = true;
        document.getElementById('userInputSection').style.display = 'none';
        return;
    }

    const currentStep = currentJson.steps.find(s => s.id === simulationState.currentStepId);
    if (!currentStep) return;

    let stepInfo = `<strong>${currentStep.id}: ${currentStep.name}</strong><br>`;
    stepInfo += `<span class="text-sm text-gray-600">${currentStep.description}</span>`;

    document.getElementById('currentStepInfo').innerHTML = stepInfo;

    // Show user input section if needed
    if (currentStep.awaits_user_input) {
        document.getElementById('userInputSection').style.display = 'block';
        document.getElementById('userInputLabel').textContent = currentStep.user_input_prompt || 'Enter your input:';
        document.getElementById('userInputField').value = '';
        document.getElementById('userInputField').focus();
    } else {
        document.getElementById('userInputSection').style.display = 'none';
    }

    // Enable next step button
    document.getElementById('nextStepBtn').disabled = false;
}

// Execute next step in simulation
async function executeNextStep() {
    if (!simulationState || simulationState.isComplete) return;

    const currentStep = currentJson.steps.find(s => s.id === simulationState.currentStepId);
    if (!currentStep) return;

    showProgress(getCurrentTranslation('executingStepText'));

    try {
        let stepInputs = {};

        // Handle user input
        if (currentStep.awaits_user_input) {
            const userInput = document.getElementById('userInputField').value.trim();
            if (!userInput) {
                showNotification('Please enter the required input.', 'error');
                hideProgress();
                return;
            }
            if (currentStep.inputs && currentStep.inputs.length > 0) {
                stepInputs[currentStep.inputs[0]] = userInput;
            }
        } else {
            // Gather inputs from previous steps and shared memory
            if (currentStep.inputs) {
                currentStep.inputs.forEach(input => {
                    // Check step outputs first
                    for (const [stepId, outputs] of Object.entries(simulationState.stepOutputs)) {
                        if (outputs[input]) {
                            stepInputs[input] = outputs[input];
                            break;
                        }
                    }
                    // Check shared memory
                    if (!stepInputs[input] && simulationState.sharedMemory[input]) {
                        stepInputs[input] = simulationState.sharedMemory[input];
                    }
                });
            }

            // Add reads from shared memory
            if (currentStep.reads) {
                currentStep.reads.forEach(readToken => {
                    if (simulationState.sharedMemory[readToken]) {
                        stepInputs[readToken] = simulationState.sharedMemory[readToken];
                    }
                });
            }
        }

        // Execute step via AI
        const systemPrompt = 'You are a simulation AI. Your task is to act as a single step in a process. Given a description, expected outputs, and available input data, generate a plausible JSON object for the outputs. Respond only with the JSON object.';
        const expectedOutputs = [...(currentStep.outputs || []), ...(currentStep.shared || [])];
        const userMessage = `Simulate step: "${currentStep.name}". Description: "${currentStep.description}". Expected outputs: ${JSON.stringify(expectedOutputs)}. Given these inputs: ${JSON.stringify(stepInputs)}. Return ONLY the JSON object with the output values.`;

        const response = await callOpenRouterAPI(userMessage, systemPrompt);
        
        // Parse outputs
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in AI response');
        }

        const stepOutputs = JSON.parse(jsonMatch[0]);

        // Store outputs
        simulationState.stepOutputs[currentStep.id] = stepOutputs;

        // Update shared memory
        if (currentStep.shared) {
            currentStep.shared.forEach(sharedToken => {
                if (stepOutputs[sharedToken]) {
                    simulationState.sharedMemory[sharedToken] = stepOutputs[sharedToken];
                }
            });
        }

        // Determine next step
        const nextStepResult = await determineNextStep(currentStep, stepOutputs);
        
        // Log the execution
        logSimulationStep(currentStep, stepInputs, stepOutputs, nextStepResult.condition);

        if (nextStepResult.nextStepId) {
            simulationState.currentStepId = nextStepResult.nextStepId;
        } else {
            simulationState.isComplete = true;
            showNotification(getCurrentTranslation('simulationComplete'), 'success');
        }

        updateSimulationModal();

    } catch (error) {
        console.error('Execute step error:', error);
        showNotification(getCurrentTranslation('errorOccurred') + error.message, 'error');
    } finally {
        hideProgress();
    }
}

// Determine next step based on conditions
async function determineNextStep(currentStep, stepOutputs) {
    const possibleLinks = currentJson.links.filter(link => link.from === currentStep.id);
    
    if (possibleLinks.length === 0) {
        return { nextStepId: null, condition: '' }; // End of flow
    }

    if (possibleLinks.length === 1 && !possibleLinks[0].condition) {
        return { nextStepId: possibleLinks[0].to, condition: '' }; // Simple next step
    }

    // Multiple links or conditional links - use AI to evaluate
    showProgress(getCurrentTranslation('evaluatingConditionText'));

    try {
        const conditions = possibleLinks.map(link => link.condition || 'true').filter(c => c !== 'true');
        
        if (conditions.length === 0) {
            // No conditions, take first link
            return { nextStepId: possibleLinks[0].to, condition: '' };
        }

        const systemPrompt = 'You are a logical evaluation AI. Given a JSON object of data and a list of conditions, determine which single condition is true. Respond with only the text of the true condition, or the string "none" if none are true.';
        const userMessage = `Given the data ${JSON.stringify(stepOutputs)}, which of these conditions is true? Respond with ONLY the condition text that is true, or "none". Conditions: [${conditions.map(c => `"${c}"`).join(', ')}]`;

        const response = await callOpenRouterAPI(userMessage, systemPrompt);
        const trueCondition = response.trim();

        if (trueCondition === 'none') {
            // No condition matched, check for unconditional link
            const unconditionalLink = possibleLinks.find(link => !link.condition);
            return { 
                nextStepId: unconditionalLink ? unconditionalLink.to : null, 
                condition: getCurrentTranslation('noConditionMatched')
            };
        }

        // Find the link with the true condition
        const matchingLink = possibleLinks.find(link => link.condition === trueCondition);
        return { 
            nextStepId: matchingLink ? matchingLink.to : null, 
            condition: trueCondition 
        };

    } catch (error) {
        console.error('Error evaluating conditions:', error);
        // Fallback to first link
        return { nextStepId: possibleLinks[0].to, condition: 'Error evaluating condition' };
    }
}

// Log simulation step
function logSimulationStep(step, inputs, outputs, condition = '') {
    const logEntry = {
        run: runCounter,
        stepName: `${step.id}: ${step.name}`,
        condition: condition,
        inputs: Object.entries(inputs).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(', '),
        outputs: Object.entries(outputs).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(', ')
    };

    simulationLog.push(logEntry);

    // Update log table
    const tbody = document.getElementById('simulationLogBody');
    const row = tbody.insertRow();
    row.insertCell(0).textContent = logEntry.run;
    row.insertCell(1).textContent = logEntry.stepName;
    row.insertCell(2).textContent = logEntry.condition;
    row.insertCell(3).textContent = logEntry.inputs;
    row.insertCell(4).textContent = logEntry.outputs;
}

// Reset simulation
function resetSimulation() {
    simulationState = null;
    runCounter++;
    closeSimulationModal();
}

// Close simulation modal
function closeSimulationModal() {
    document.getElementById('simulationModal').classList.add('hidden');
}

// Export simulation log as CSV
function exportSimulationLog() {
    if (simulationLog.length === 0) {
        showNotification(getCurrentTranslation('noSimulationData'), 'error');
        return;
    }

    let csv = 'Run,Step,Condition,Inputs,Outputs\n';
    simulationLog.forEach(entry => {
        csv += `"${entry.run}","${entry.stepName}","${entry.condition}","${entry.inputs}","${entry.outputs}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = 'diagrammaton-simulation-log.csv';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
}