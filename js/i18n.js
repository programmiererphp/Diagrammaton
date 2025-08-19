// Internationalization for Diagrammaton
const I18N = {
    en: {
        headerSubtitle: "AI-Powered Process Flow Generator",
        configTitle: "Configuration",
        apiKeyLabel: "OpenRouter API Key",
        modelLabel: "Model",
        temperatureLabel: "Temperature",
        testApiText: "Test API",
        examplesTitle: "Example Flows",
        selectExampleOption: "Select an example...",
        loadExampleText: "Load Example",
        descriptionTitle: "Flow Description",
        undoText: "Undo",
        redoText: "Redo",
        resetText: "Reset",
        generateText: "Generate Diagram",
        editTitle: "Edit Diagram",
        applyChangesText: "Apply Changes",
        diagramTitle: "Diagram",
        copyMermaidText: "Copy Mermaid",
        downloadPngText: "Download PNG",
        simulateText: "Simulate Flow",
        structuredTextSummary: "Structured Text View",
        simulationLogTitle: "Simulation Log",
        runHeader: "Run #",
        stepHeader: "Step",
        conditionHeader: "Condition",
        inputsHeader: "Inputs",
        outputsHeader: "Outputs",
        exportLogText: "Export Log (CSV)",
        importExportTitle: "Import/Export",
        exportJsonText: "Export JSON",
        exportXmlText: "Export XML",
        importText: "Import File",
        stepModalTitle: "Step Details",
        simulationModalTitle: "Flow Simulation",
        currentStepTitle: "Current Step:",
        userInputLabel: "User Input Required:",
        nextStepText: "Next Step",
        resetSimulationText: "Reset Simulation",
        infoModalTitle: "Information",
        apiKeyMissing: "Please enter your OpenRouter API Key first.",
        noDiagramGenerated: "Please generate a diagram first.",
        processingText: "Processing...",
        testingApiText: "Testing API...",
        generatingText: "Generating diagram...",
        applyingChangesText: "Applying changes...",
        executingStepText: "Executing step...",
        evaluatingConditionText: "Evaluating condition...",
        apiTestSuccess: "API connection successful!",
        apiTestFailed: "API test failed. Please check your API key.",
        diagramGenerated: "Diagram generated successfully!",
        changesApplied: "Changes applied successfully!",
        simulationComplete: "Simulation completed!",
        errorOccurred: "An error occurred: ",
        descriptionPlaceholder: "Describe your process in natural language...",
        editPlaceholder: "Describe what changes you want to make...",
        infoConfig: "Configure your OpenRouter API key and model settings. The API key is required to generate and edit diagrams.",
        infoExamples: "Load predefined example flows to get started quickly. Examples are available in multiple languages.",
        infoDescription: "Describe your process in natural language. The AI will convert it into a structured flowchart.",
        infoEdit: "Provide instructions to modify the current diagram. The AI will update the flowchart based on your changes.",
        infoDiagram: "View the generated flowchart. Click on nodes to see step details. Use the simulation to test your process logic.",
        infoSimulationLog: "Track all simulation runs with detailed logs of inputs, outputs, and conditions evaluated.",
        infoImportExport: "Save your work or load previous diagrams. Export formats include JSON, XML, and CSV for simulation logs.",
        generateExampleText: "Generate Example",
        inputsLabel: "Inputs:",
        outputsLabel: "Outputs:",
        sharedMemoryWritesLabel: "Shared Memory Writes:",
        sharedMemoryReadsLabel: "Shared Memory Reads:",
        userInputRequiredLabel: "User Input Required:",
        exampleValuePlaceholder: "Example value...",
        simulationCompleteMessage: "Simulation completed successfully!",
        noConditionMatched: "No condition matched, taking default path.",
        fileImportedSuccess: "File imported successfully!",
        fileImportError: "Error importing file: ",
        noSimulationData: "No simulation data to export.",
        mermaidCodeCopied: "Mermaid code copied to clipboard!",
        resetConfirmation: "Are you sure you want to reset everything? This will clear all data.",
        xmlImportSimplified: "XML import is simplified. For full functionality, use JSON export/import."
    },
    de: {
        headerSubtitle: "KI-gestützter Prozessfluss-Generator",
        configTitle: "Konfiguration",
        apiKeyLabel: "OpenRouter API-Schlüssel",
        modelLabel: "Modell",
        temperatureLabel: "Temperatur",
        testApiText: "API testen",
        examplesTitle: "Beispielabläufe",
        selectExampleOption: "Beispiel auswählen...",
        loadExampleText: "Beispiel laden",
        descriptionTitle: "Ablaufbeschreibung",
        undoText: "Rückgängig",
        redoText: "Wiederholen",
        resetText: "Zurücksetzen",
        generateText: "Diagramm erstellen",
        editTitle: "Diagramm bearbeiten",
        applyChangesText: "Änderungen anwenden",
        diagramTitle: "Diagramm",
        copyMermaidText: "Mermaid kopieren",
        downloadPngText: "PNG herunterladen",
        simulateText: "Ablauf simulieren",
        structuredTextSummary: "Strukturierte Textansicht",
        simulationLogTitle: "Simulationsprotokoll",
        runHeader: "Lauf #",
        stepHeader: "Schritt",
        conditionHeader: "Bedingung",
        inputsHeader: "Eingaben",
        outputsHeader: "Ausgaben",
        exportLogText: "Protokoll exportieren (CSV)",
        importExportTitle: "Import/Export",
        exportJsonText: "JSON exportieren",
        exportXmlText: "XML exportieren",
        importText: "Datei importieren",
        stepModalTitle: "Schrittdetails",
        simulationModalTitle: "Ablaufsimulation",
        currentStepTitle: "Aktueller Schritt:",
        userInputLabel: "Benutzereingabe erforderlich:",
        nextStepText: "Nächster Schritt",
        resetSimulationText: "Simulation zurücksetzen",
        infoModalTitle: "Information",
        apiKeyMissing: "Bitte geben Sie zuerst Ihren OpenRouter API-Schlüssel ein.",
        noDiagramGenerated: "Bitte erstellen Sie zuerst ein Diagramm.",
        processingText: "Verarbeitung...",
        testingApiText: "API wird getestet...",
        generatingText: "Diagramm wird erstellt...",
        applyingChangesText: "Änderungen werden angewendet...",
        executingStepText: "Schritt wird ausgeführt...",
        evaluatingConditionText: "Bedingung wird ausgewertet...",
        apiTestSuccess: "API-Verbindung erfolgreich!",
        apiTestFailed: "API-Test fehlgeschlagen. Bitte überprüfen Sie Ihren API-Schlüssel.",
        diagramGenerated: "Diagramm erfolgreich erstellt!",
        changesApplied: "Änderungen erfolgreich angewendet!",
        simulationComplete: "Simulation abgeschlossen!",
        errorOccurred: "Ein Fehler ist aufgetreten: ",
        descriptionPlaceholder: "Beschreiben Sie Ihren Prozess in natürlicher Sprache...",
        editPlaceholder: "Beschreiben Sie, welche Änderungen Sie vornehmen möchten...",
        infoConfig: "Konfigurieren Sie Ihren OpenRouter API-Schlüssel und Modelleinstellungen. Der API-Schlüssel ist erforderlich, um Diagramme zu erstellen und zu bearbeiten.",
        infoExamples: "Laden Sie vordefinierte Beispielabläufe, um schnell zu beginnen. Beispiele sind in mehreren Sprachen verfügbar.",
        infoDescription: "Beschreiben Sie Ihren Prozess in natürlicher Sprache. Die KI wird ihn in ein strukturiertes Flussdiagramm umwandeln.",
        infoEdit: "Geben Sie Anweisungen zur Änderung des aktuellen Diagramms. Die KI wird das Flussdiagramm basierend auf Ihren Änderungen aktualisieren.",
        infoDiagram: "Betrachten Sie das generierte Flussdiagramm. Klicken Sie auf Knoten, um Schrittdetails zu sehen. Verwenden Sie die Simulation, um Ihre Prozesslogik zu testen.",
        infoSimulationLog: "Verfolgen Sie alle Simulationsläufe mit detaillierten Protokollen von Eingaben, Ausgaben und ausgewerteten Bedingungen.",
        infoImportExport: "Speichern Sie Ihre Arbeit oder laden Sie vorherige Diagramme. Exportformate umfassen JSON, XML und CSV für Simulationsprotokolle.",
        generateExampleText: "Beispiel generieren",
        inputsLabel: "Eingaben:",
        outputsLabel: "Ausgaben:",
        sharedMemoryWritesLabel: "Geteilter Speicher Schreibvorgänge:",
        sharedMemoryReadsLabel: "Geteilter Speicher Lesevorgänge:",
        userInputRequiredLabel: "Benutzereingabe erforderlich:",
        exampleValuePlaceholder: "Beispielwert...",
        simulationCompleteMessage: "Simulation erfolgreich abgeschlossen!",
        noConditionMatched: "Keine Bedingung erfüllt, nehme Standardpfad.",
        fileImportedSuccess: "Datei erfolgreich importiert!",
        fileImportError: "Fehler beim Importieren der Datei: ",
        noSimulationData: "Keine Simulationsdaten zum Exportieren.",
        mermaidCodeCopied: "Mermaid-Code in die Zwischenablage kopiert!",
        resetConfirmation: "Sind Sie sicher, dass Sie alles zurücksetzen möchten? Dies löscht alle Daten.",
        xmlImportSimplified: "XML-Import ist vereinfacht. Für volle Funktionalität verwenden Sie JSON Export/Import."
    },
    ru: {
        headerSubtitle: "ИИ-генератор процессных диаграмм",
        configTitle: "Конфигурация",
        apiKeyLabel: "API-ключ OpenRouter",
        modelLabel: "Модель",
        temperatureLabel: "Температура",
        testApiText: "Тест API",
        examplesTitle: "Примеры процессов",
        selectExampleOption: "Выберите пример...",
        loadExampleText: "Загрузить пример",
        descriptionTitle: "Описание процесса",
        undoText: "Отменить",
        redoText: "Повторить",
        resetText: "Сброс",
        generateText: "Создать диаграмму",
        editTitle: "Редактировать диаграмму",
        applyChangesText: "Применить изменения",
        diagramTitle: "Диаграмма",
        copyMermaidText: "Копировать Mermaid",
        downloadPngText: "Скачать PNG",
        simulateText: "Симулировать процесс",
        structuredTextSummary: "Структурированный текст",
        simulationLogTitle: "Журнал симуляции",
        runHeader: "Запуск #",
        stepHeader: "Шаг",
        conditionHeader: "Условие",
        inputsHeader: "Входы",
        outputsHeader: "Выходы",
        exportLogText: "Экспорт журнала (CSV)",
        importExportTitle: "Импорт/Экспорт",
        exportJsonText: "Экспорт JSON",
        exportXmlText: "Экспорт XML",
        importText: "Импорт файла",
        stepModalTitle: "Детали шага",
        simulationModalTitle: "Симуляция процесса",
        currentStepTitle: "Текущий шаг:",
        userInputLabel: "Требуется ввод пользователя:",
        nextStepText: "Следующий шаг",
        resetSimulationText: "Сброс симуляции",
        infoModalTitle: "Информация",
        apiKeyMissing: "Пожалуйста, введите ваш API-ключ OpenRouter.",
        noDiagramGenerated: "Пожалуйста, сначала создайте диаграмму.",
        processingText: "Обработка...",
        testingApiText: "Тестирование API...",
        generatingText: "Создание диаграммы...",
        applyingChangesText: "Применение изменений...",
        executingStepText: "Выполнение шага...",
        evaluatingConditionText: "Оценка условия...",
        apiTestSuccess: "Подключение к API успешно!",
        apiTestFailed: "Тест API не удался. Проверьте ваш API-ключ.",
        diagramGenerated: "Диаграмма успешно создана!",
        changesApplied: "Изменения успешно применены!",
        simulationComplete: "Симуляция завершена!",
        errorOccurred: "Произошла ошибка: ",
        descriptionPlaceholder: "Опишите ваш процесс на естественном языке...",
        editPlaceholder: "Опишите, какие изменения вы хотите внести...",
        infoConfig: "Настройте ваш API-ключ OpenRouter и параметры модели. API-ключ необходим для создания и редактирования диаграмм.",
        infoExamples: "Загрузите предопределенные примеры процессов для быстрого старта. Примеры доступны на нескольких языках.",
        infoDescription: "Опишите ваш процесс на естественном языке. ИИ преобразует его в структурированную блок-схему.",
        infoEdit: "Предоставьте инструкции для изменения текущей диаграммы. ИИ обновит блок-схему на основе ваших изменений.",
        infoDiagram: "Просмотрите созданную блок-схему. Нажмите на узлы, чтобы увидеть детали шагов. Используйте симуляцию для тестирования логики процесса.",
        infoSimulationLog: "Отслеживайте все запуски симуляции с подробными журналами входов, выходов и оцененных условий.",
        infoImportExport: "Сохраните вашу работу или загрузите предыдущие диаграммы. Форматы экспорта включают JSON, XML и CSV для журналов симуляции.",
        generateExampleText: "Генерировать пример",
        inputsLabel: "Входы:",
        outputsLabel: "Выходы:",
        sharedMemoryWritesLabel: "Записи в общую память:",
        sharedMemoryReadsLabel: "Чтения из общей памяти:",
        userInputRequiredLabel: "Требуется ввод пользователя:",
        exampleValuePlaceholder: "Пример значения...",
        simulationCompleteMessage: "Симуляция успешно завершена!",
        noConditionMatched: "Ни одно условие не выполнено, выбираю путь по умолчанию.",
        fileImportedSuccess: "Файл успешно импортирован!",
        fileImportError: "Ошибка импорта файла: ",
        noSimulationData: "Нет данных симуляции для экспорта.",
        mermaidCodeCopied: "Код Mermaid скопирован в буфер обмена!",
        resetConfirmation: "Вы уверены, что хотите сбросить всё? Это удалит все данные.",
        xmlImportSimplified: "Импорт XML упрощен. Для полной функциональности используйте экспорт/импорт JSON."
    }
};

// Get current translation
function getCurrentTranslation(key) {
    const lang = document.getElementById('languageSelect')?.value || 'en';
    return I18N[lang][key] || I18N.en[key] || key;
}

// Update UI language
function updateLanguage() {
    let lang = document.getElementById('languageSelect').value;
    let translations = I18N[lang];

    // Fallback to English if language is invalid
    if (!translations) {
        lang = 'en';
        translations = I18N[lang];
        document.getElementById('languageSelect').value = lang;
    }

    // Update all translatable elements
    Object.keys(translations).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'password')) {
                if (key.includes('Placeholder')) {
                    element.placeholder = translations[key];
                }
            } else if (element.tagName === 'TEXTAREA') {
                if (key.includes('Placeholder')) {
                    element.placeholder = translations[key];
                }
            } else {
                element.textContent = translations[key];
            }
        }
    });

    // Update placeholders specifically
    const processDescription = document.getElementById('processDescription');
    if (processDescription) {
        processDescription.placeholder = translations.descriptionPlaceholder;
    }

    const editInstructions = document.getElementById('editInstructions');
    if (editInstructions) {
        editInstructions.placeholder = translations.editPlaceholder;
    }

    // Update document language
    document.documentElement.lang = lang;
}