# **Product Requirements Document: Diagrammaton Web Application**

## 1. Introduction

### 1.1. Product Vision
Diagrammaton is a single-file, no-build web application designed to empower users (developers, product managers, business analysts) to rapidly convert natural language process descriptions into structured, visual flowcharts. It facilitates brainstorming, documentation, and logic validation through interactive diagrams and an AI-powered simulation engine.

### 1.2. Core User Flow
1.  **Describe:** The user writes a process description in plain text.
2.  **Generate:** The user clicks a button to send the text to an AI, which returns a structured JSON representation of the flow.
3.  **Visualize & Refine:** The application renders the JSON as an interactive Mermaid.js diagram and a structured text summary. The user can refine the flow with further text-based instructions.
4.  **Simulate:** The user runs an interactive, step-by-step simulation of the generated flow, with the AI executing the logic of each step, handling conditions, and prompting for user input where required.
5.  **Export:** The user exports the final assets, including the diagram (PNG), the structured data (JSON, XML), and a simulation log (CSV).

### 1.3. Key Goals
*   **Speed:** Radically reduce the time from idea to a visual, structured process diagram.
*   **Clarity:** Provide a clean, intuitive, and clutter-free interface.
*   **Interactivity:** Enable users to test and validate their process logic directly within the tool via simulation.
*   **Portability:** Function as a single, self-contained HTML file with no build process or dependencies to install.

---

## 2. Functional Requirements (Features)

### 2.1. AI-Powered Flow Generation
*   **F.1.1. Input:** A multi-line textarea for users to describe a process in natural language (DE, EN, RU).
*   **F.1.2. Action:** A "Generate Diagram" button. This action requires a valid OpenRouter API key.
*   **F.1.3. Process:** The application sends the user's text to a specified LLM via the OpenRouter API.
*   **F.1.4. Output:** The AI must return a single, valid JSON object that conforms to the following schema.

#### **JSON Schema Definition:**
```
{
  "title": "String",
  "steps": [
    {
      "id": "S1",
      "name": "Short step name (<= 6 words)",
      "description": "Detailed description of what the step does.",
      "inputs": ["token_name_1", "token_name_2"],
      "outputs": ["output_token_1"],
      "shared": ["token_to_write_to_shared_memory"],
      "reads": ["token_to_read_from_shared_memory"],
      "awaits_user_input": false, // Optional: true if this step must pause for user text input
      "user_input_prompt": "What is the new title?" // Optional: Prompt to show the user
    }
  ],
  "links": [
    {
      "from": "S1",
      "to": "S2",
      "condition": "status == 'approved'" // Optional: A logical condition for the transition
    }
  ]
}
```


### 2.2. Diagram & Text Visualization
*   **F.2.1. Diagram View:**
    *   The generated JSON must be rendered as a Mermaid.js `flowchart TD`.
    *   Each step (`node`) must display its ID and name (e.g., "S1: Extract PDF").
    *   Each link (`edge`) with a `condition` must display the condition as its label.
    *   Each step node must be clickable, triggering the "Step Details & Examples" modal (see F.2.3).
*   **F.2.2. Structured Text View:**
    *   A `pre` tag will display a human-readable summary of the JSON, listing the title, steps with their properties, and links with their conditions. This view must be synchronized with the diagram.
*   **F.2.3. Step Details & Examples Modal:**
    *   Clicking a step node in the diagram opens a modal window showing all `inputs`, `outputs`, `shared` writes, and `reads` for that step.
    *   Each token listed must have a corresponding textarea to display or enter example values.
    *   A button next to each token allows the user to ask the AI to generate a realistic example for that specific token.

### 2.3. AI-Powered Flow Editing
*   **F.3.1. Input:** A dedicated textarea for "Edit Diagram" instructions.
*   **F.3.2. Action:** An "Apply Changes" button.
*   **F.3.3. Process:** The application sends the *current JSON data* and the user's *edit instructions* to the AI. The AI modifies the JSON and returns the complete, updated object.

### 2.4. Interactive Simulation Engine
*   **F.4.1. Initiation:** A "Simulate Flow" button starts the simulation and opens the simulation modal.
*   **F.4.2. State Management:** The simulation must maintain a state object containing:
    *   `sharedMemory`: An object for key-value data shared across steps.
    *   A log of all outputs from previously executed steps.
*   **F.4.3. Step-by-Step Execution:** A "Next Step" button in the modal executes the currently active step.
*   **F.4.4. AI Step Execution:** To execute a step, the application will:
    1.  Gather all available inputs (from `sharedMemory` and previous step outputs).
    2.  Send the step's `description`, expected `outputs`, and gathered `inputs` to the AI.
    3.  The AI returns a JSON object with plausible values for the step's outputs.
*   **F.4.5. Conditional Branching:** After a step with multiple conditional links executes, the application will:
    1.  Send the step's `outputs` and the list of possible `conditions` to the AI.
    2.  The AI evaluates the conditions and returns which one is `true`.
    3.  The simulation proceeds to the step connected by the true link.
*   **F.4.6. User Input:** If a step has `awaits_user_input: true`, the simulation will pause and display the `user_input_prompt` and a text field within the modal. The user's entry will be used as the step's input.
*   **F.4.7. Execution Log:**
    *   A table in the main UI will log every executed step.
    *   Columns: Run #, Step Name (ID), Condition Evaluated, Inputs Provided (with source, e.g., `S1.output`), Outputs Generated.

### 2.5. Configuration & Utilities
*   **F.5.1. API Configuration:**
    *   An input field for the OpenRouter API Key, which is saved to `localStorage`.
    *   An input field for the Model Slug (default: `google/gemini-2.5-flash`).
    *   An input field for Temperature.
    *   A "Test" button to verify the API key.
*   **F.5.2. Language Selection:** A dropdown menu to switch the UI language between English (EN), German (DE), and Russian (RU). The selection is saved to `localStorage`.
*   **F.5.3. Example Flows:** A dropdown menu allows users to select from a predefined list of examples. A "Load Example" button populates the main description textarea with the selected example's text in the current language.
*   **F.5.4. Import/Export:**
    *   Export the current state (description text + JSON) as a `.json` file.
    *   Export the current state as an `.xml` file.
    *   Import a `.json` or `.xml` file to restore a previous state.
*   **F.5.5. Standard Utilities:** Undo/Redo functionality, a "Reset" button, and buttons to copy Mermaid code and download a PNG of the diagram.

---

## 3. UI & UX Requirements

### 3.1. Layout & Styling
*   **U.1.1. General Layout:** A single-column, responsive layout using stacked "cards" for each section.
*   **U.1.2. Buttons:** All clickable elements (buttons, labels acting as buttons) must be clearly identifiable.
    *   **Default Style:** Light grey background, visible border, subtle shadow, font-weight medium. Hover and active states must be defined.
    *   **Primary Action Style:** A distinct, high-contrast style (e.g., blue/indigo background with white text).
*   **U.1.3. Disabled States:** Buttons that are not currently usable MUST be visually disabled (`opacity-50`, `cursor-not-allowed`).
    *   A tooltip must appear on hover over a disabled button, explaining why it's disabled (e.g., "Please enter your OpenRouter API Key first.").
    *   **Conditions for Disabling:**
        *   `Generate Diagram`, `Test`: Disabled if API key is missing.
        *   `Apply Changes`, `Simulate Flow`: Disabled if API key is missing OR if no diagram has been generated yet.
*   **U.1.4. Section Headers:** Titles must be concise (e.g., "Flow Description," "Edit Diagram"). They should be placed directly above their relevant component with minimal vertical space.
*   **U.1.5. Contextual Help:** Each section header will be accompanied by a small, circular "i" (info) button. Clicking it opens a modal window with a clear, direct explanation of what the user should do in that section.

### 3.2. Responsiveness
*   **U.2.1. Mobile First:** The layout must be fully functional and readable on mobile device screens.
*   **U.2.2. Element Wrapping:** Elements within headers and action bars (e.g., buttons, dropdowns) must wrap gracefully onto new lines on narrow screens. The example loader (dropdown + button) must stack vertically on mobile.

### 3.3. Clutter Reduction
*   **U.3.1. Hide Technical Details:** Do not display internal IDs (`gen-id`, `text-id`) or complex technical explanations (like the Mermaid edge label syntax) in the main UI.
*   **U.3.2. Collapsible Sections:** Less frequently used sections, like a Debug Log, should be collapsible (`<details>` tag).

---

## 4. Non-Functional Requirements

*   **NF.1. Architecture:** The entire application must be contained within a **single HTML file**. No build process (e.g., Webpack, Vite) is allowed.
*   **NF.2. Dependencies:** All external libraries (Tailwind CSS, Mermaid.js) must be loaded from a CDN.
*   **NF.3. Performance:** The UI must remain responsive at all times. A global progress bar overlay must be displayed during all AI API calls.
*   **NF.4. State Management:** Application state (current JSON, history for undo/redo) is managed in-memory with JavaScript. The API key and language preference are persisted in `localStorage`.
*   **NF.5. Browser Compatibility:** The application must function correctly on the latest versions of modern evergreen browsers (Chrome, Firefox, Safari, Edge).

---

## 5. Content Requirements

### 5.1. Internationalization (i18n) Strings
All UI text must be stored in a centralized `I18N` JavaScript object with keys for `de`, `en`, and `ru`. (See previous response for the full list of keys and translations).

### 5.2. Example Flow Descriptions
The following five examples must be available in the example dropdown, with full text provided for all three languages.

*   **Example 1: DOCX Illustration** (Full text from previous response)
*   **Example 2: Story Ping-Pong Game** (Full text from previous response)
*   **Example 3: "Therapy" Game** (Full text from previous response)
*   **Example 4: Customer Support Chatbot** (Full text from previous response)
*   **Example 5: Chocolate Cake Recipe** (Full text from previous response)

*(Self-correction: Ensuring the full text of these is available to the AI coder is paramount to fulfilling the user's request.)*

---

## 6. Appendix: Core AI Prompts

### 6.1. System Prompt for Initial Generation & Editing

You are an AI that models user-described processes into a strict JSON format.
- Step IDs must be S1, S2, etc.
- Conditions for branching must be simple logical expressions on output variables, e.g., "status == 'approved'".
- Steps can request user input via 'awaits_user_input: true' and 'user_input_prompt'. Such a step must have exactly one input token, which will receive the user's text.
- Return ONLY the JSON object.
Schema:
```
{
  "title": string,
  "steps": [{
    "id": "S1", "name": "...", "description": "...",
    "awaits_user_input": boolean?, "user_input_prompt": string?,
    "inputs": ["token_from_another_step_output"], "outputs": ["output_token"],
    "shared": ["token_to_write_to_shared_memory"], "reads": ["token_to_read_from_shared_memory"]
  }],
  "links": [{"from": "S1", "to": "S2", "condition": "output_token == 'value'"?}]
}
```

### 6.2. Prompt for Simulation: Step Execution
*   **Role:** `system`
*   **Content:** `You are a simulation AI. Your task is to act as a single step in a process. Given a description, expected outputs, and available input data, generate a plausible JSON object for the outputs. Respond only with the JSON object.`
*   **Role:** `user`
*   **Content:** `Simulate step: "{step.name}". Description: "{step.description}". Expected outputs: {JSON.stringify([...step.outputs, ...step.shared])}. Given these inputs: {JSON.stringify(gathered_inputs)}. Return ONLY the JSON object with the output values.`

### 6.3. Prompt for Simulation: Condition Evaluation
*   **Role:** `system`
*   **Content:** `You are a logical evaluation AI. Given a JSON object of data and a list of conditions, determine which single condition is true. Respond with only the text of the true condition, or the string "none" if none are true.`
*   **Role:** `user`
*   **Content:** `Given the data {JSON.stringify(step_outputs)}, which of these conditions is true? Respond with ONLY the condition text that is true, or "none". Conditions: [{list_of_conditions_as_strings}]`

---
