# Diagrammaton

AI-Powered Process Flow Generator - A comprehensive web application for converting natural language process descriptions into interactive flowcharts with simulation capabilities.

## Features

### Core Functionality
- **AI-Powered Flow Generation**: Convert natural language descriptions into structured JSON flowcharts using OpenRouter API
- **Interactive Diagram Visualization**: Mermaid.js-based flowcharts with clickable nodes
- **Flow Editing**: Modify existing diagrams with natural language instructions
- **Step-by-Step Simulation**: Interactive simulation engine with AI-powered step execution
- **Multi-language Support**: English, German, and Russian interface

### Advanced Features
- **Step Details Modal**: View and edit step inputs, outputs, and shared memory
- **Simulation Logging**: Track all simulation runs with detailed logs
- **Import/Export**: JSON and XML export/import functionality
- **History Management**: Undo/redo functionality with state history
- **Example Flows**: Pre-built examples in multiple languages
- **Responsive Design**: Mobile-first responsive layout

## Getting Started

### Prerequisites
- OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))
- Modern web browser with JavaScript enabled

### Installation
1. Clone or download this repository
2. Serve the files using any web server (e.g., `python3 -m http.server 8000`)
3. Open the application in your browser
4. Enter your OpenRouter API key in the Configuration section

### Usage
1. **Configure**: Enter your OpenRouter API key and select your preferred model
2. **Describe**: Write a process description in natural language
3. **Generate**: Click "Generate Diagram" to create a flowchart
4. **Refine**: Use the edit functionality to modify the diagram
5. **Simulate**: Run interactive simulations to test your process logic
6. **Export**: Save your work in JSON or XML format

## File Structure

```
Diagrammaton/
├── index.html              # Main HTML file
├── styles/
│   └── main.css            # Application styles
├── js/
│   ├── main.js             # Main application logic
│   ├── i18n.js             # Internationalization
│   ├── examples.js         # Example flows
│   ├── api.js              # API handling
│   ├── diagram.js          # Diagram rendering
│   ├── simulation.js       # Simulation engine
│   ├── storage.js          # Import/export functionality
│   └── ui.js               # UI utilities
├── previous versions/      # Previous implementations
├── prd.md                  # Product Requirements Document
└── README.md               # This file
```

## API Integration

The application uses the OpenRouter API to access various AI models. Supported models include:
- Google Gemini 2.0 Flash (default)
- OpenAI GPT models
- Anthropic Claude models
- And many others available through OpenRouter

## JSON Schema

The application generates flowcharts in the following JSON format:

```json
{
  "title": "Process Title",
  "steps": [
    {
      "id": "S1",
      "name": "Step Name",
      "description": "Detailed description",
      "inputs": ["input_token"],
      "outputs": ["output_token"],
      "shared": ["shared_memory_token"],
      "reads": ["read_token"],
      "awaits_user_input": false,
      "user_input_prompt": "Optional prompt"
    }
  ],
  "links": [
    {
      "from": "S1",
      "to": "S2",
      "condition": "optional_condition"
    }
  ]
}
```

## Simulation Engine

The simulation engine provides:
- **Step-by-step execution**: Execute each step with AI-generated outputs
- **Conditional branching**: AI evaluates conditions to determine flow paths
- **User input handling**: Pause for user input when required
- **State management**: Maintain shared memory and step outputs
- **Comprehensive logging**: Track all simulation runs with detailed logs

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This is a single-repository project. To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. Please check the repository for license details.

## Support

For issues and questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include browser console logs if applicable

## Changelog

### Version 1.0.0
- Initial implementation based on PRD requirements
- Multi-file architecture for better maintainability
- Complete feature set including simulation engine
- Multi-language support (EN, DE, RU)
- Responsive design with mobile support
- Comprehensive error handling and user feedback