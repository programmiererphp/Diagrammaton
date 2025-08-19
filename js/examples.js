// Example flows for Diagrammaton
const EXAMPLES = {
    docx: {
        en: `Create a DOCX document with illustrations from a PDF source.

Steps:
1. User uploads a PDF file
2. Extract text content from PDF
3. Identify sections that need illustrations
4. Generate illustration descriptions based on text
5. Create illustrations using AI image generation
6. Format content into DOCX structure
7. Insert illustrations at appropriate positions
8. Apply styling and formatting
9. Save and provide download link

The process should handle errors gracefully and provide progress updates to the user.`,
        de: `Erstelle ein DOCX-Dokument mit Illustrationen aus einer PDF-Quelle.

Schritte:
1. Benutzer lädt eine PDF-Datei hoch
2. Textinhalt aus PDF extrahieren
3. Abschnitte identifizieren, die Illustrationen benötigen
4. Illustrationsbeschreibungen basierend auf Text generieren
5. Illustrationen mit KI-Bildgenerierung erstellen
6. Inhalt in DOCX-Struktur formatieren
7. Illustrationen an geeigneten Positionen einfügen
8. Styling und Formatierung anwenden
9. Speichern und Download-Link bereitstellen

Der Prozess sollte Fehler elegant behandeln und dem Benutzer Fortschrittsupdates geben.`,
        ru: `Создать DOCX документ с иллюстрациями из PDF источника.

Шаги:
1. Пользователь загружает PDF файл
2. Извлечь текстовое содержимое из PDF
3. Определить разделы, которые нуждаются в иллюстрациях
4. Сгенерировать описания иллюстраций на основе текста
5. Создать иллюстрации с помощью ИИ генерации изображений
6. Отформатировать содержимое в структуру DOCX
7. Вставить иллюстрации в подходящих позициях
8. Применить стилизацию и форматирование
9. Сохранить и предоставить ссылку для скачивания

Процесс должен корректно обрабатывать ошибки и предоставлять пользователю обновления прогресса.`
    },
    pingpong: {
        en: `Interactive story ping-pong game between user and AI.

Steps:
1. User starts a story with initial premise
2. AI continues the story with 2-3 sentences
3. User adds their continuation
4. AI responds with plot development
5. Check if story should end (after 10 exchanges or user requests)
6. If continuing, go back to step 3
7. If ending, AI provides a satisfying conclusion
8. Save complete story for user

The AI should maintain consistency with previous story elements and create engaging plot developments.`,
        de: `Interaktives Story-Ping-Pong-Spiel zwischen Benutzer und KI.

Schritte:
1. Benutzer startet eine Geschichte mit anfänglicher Prämisse
2. KI setzt die Geschichte mit 2-3 Sätzen fort
3. Benutzer fügt seine Fortsetzung hinzu
4. KI antwortet mit Handlungsentwicklung
5. Prüfen, ob die Geschichte enden sollte (nach 10 Austauschen oder Benutzeranfrage)
6. Wenn fortgesetzt wird, zurück zu Schritt 3
7. Wenn beendet wird, bietet KI einen zufriedenstellenden Abschluss
8. Vollständige Geschichte für Benutzer speichern

Die KI sollte Konsistenz mit vorherigen Geschichtenelementen beibehalten und fesselnde Handlungsentwicklungen schaffen.`,
        ru: `Интерактивная игра в пинг-понг историй между пользователем и ИИ.

Шаги:
1. Пользователь начинает историю с начальной предпосылки
2. ИИ продолжает историю 2-3 предложениями
3. Пользователь добавляет свое продолжение
4. ИИ отвечает развитием сюжета
5. Проверить, должна ли история закончиться (после 10 обменов или по запросу пользователя)
6. Если продолжается, вернуться к шагу 3
7. Если заканчивается, ИИ предоставляет удовлетворительное заключение
8. Сохранить полную историю для пользователя

ИИ должен поддерживать согласованность с предыдущими элементами истории и создавать увлекательные развития сюжета.`
    },
    therapy: {
        en: `AI therapy session simulation game.

Steps:
1. User describes their current emotional state or concern
2. AI responds with empathetic acknowledgment
3. AI asks clarifying questions about the situation
4. User provides more details
5. AI offers perspective or coping strategies
6. User reflects on the suggestions
7. Check if user wants to continue or feels satisfied
8. If continuing, AI asks follow-up questions
9. If satisfied, AI provides session summary and encouragement

The AI should maintain a supportive, non-judgmental tone and provide helpful insights.`,
        de: `KI-Therapiesitzung-Simulationsspiel.

Schritte:
1. Benutzer beschreibt seinen aktuellen emotionalen Zustand oder Sorge
2. KI antwortet mit empathischer Anerkennung
3. KI stellt klärende Fragen zur Situation
4. Benutzer gibt weitere Details
5. KI bietet Perspektive oder Bewältigungsstrategien
6. Benutzer reflektiert über die Vorschläge
7. Prüfen, ob Benutzer fortfahren möchte oder zufrieden ist
8. Wenn fortgesetzt wird, stellt KI Nachfragen
9. Wenn zufrieden, bietet KI Sitzungszusammenfassung und Ermutigung

Die KI sollte einen unterstützenden, nicht wertenden Ton beibehalten und hilfreiche Einsichten bieten.`,
        ru: `Игра-симуляция терапевтической сессии с ИИ.

Шаги:
1. Пользователь описывает свое текущее эмоциональное состояние или беспокойство
2. ИИ отвечает с эмпатическим признанием
3. ИИ задает уточняющие вопросы о ситуации
4. Пользователь предоставляет больше деталей
5. ИИ предлагает перспективу или стратегии преодоления
6. Пользователь размышляет над предложениями
7. Проверить, хочет ли пользователь продолжить или чувствует удовлетворение
8. Если продолжается, ИИ задает дополнительные вопросы
9. Если удовлетворен, ИИ предоставляет резюме сессии и поощрение

ИИ должен поддерживать поддерживающий, не осуждающий тон и предоставлять полезные инсайты.`
    },
    chatbot: {
        en: `Customer support chatbot workflow.

Steps:
1. Customer initiates conversation with greeting or question
2. Bot analyzes intent and sentiment of message
3. If simple FAQ, provide direct answer
4. If complex issue, gather additional information
5. Check knowledge base for relevant solutions
6. If solution found, provide step-by-step guidance
7. If no solution, escalate to human agent
8. Follow up to ensure customer satisfaction
9. Log interaction for future improvements

The bot should be helpful, professional, and know when to escalate issues.`,
        de: `Kundensupport-Chatbot-Workflow.

Schritte:
1. Kunde beginnt Gespräch mit Begrüßung oder Frage
2. Bot analysiert Absicht und Stimmung der Nachricht
3. Bei einfacher FAQ, direkte Antwort geben
4. Bei komplexem Problem, zusätzliche Informationen sammeln
5. Wissensdatenbank nach relevanten Lösungen durchsuchen
6. Wenn Lösung gefunden, schrittweise Anleitung geben
7. Wenn keine Lösung, an menschlichen Agent weiterleiten
8. Nachfassen, um Kundenzufriedenheit sicherzustellen
9. Interaktion für zukünftige Verbesserungen protokollieren

Der Bot sollte hilfreich, professionell sein und wissen, wann Probleme eskaliert werden müssen.`,
        ru: `Рабочий процесс чат-бота службы поддержки клиентов.

Шаги:
1. Клиент начинает разговор с приветствием или вопросом
2. Бот анализирует намерение и настроение сообщения
3. Если простой FAQ, предоставить прямой ответ
4. Если сложная проблема, собрать дополнительную информацию
5. Проверить базу знаний на предмет релевантных решений
6. Если решение найдено, предоставить пошаговое руководство
7. Если нет решения, эскалировать к человеку-агенту
8. Проследить, чтобы обеспечить удовлетворенность клиента
9. Записать взаимодействие для будущих улучшений

Бот должен быть полезным, профессиональным и знать, когда эскалировать проблемы.`
    },
    recipe: {
        en: `Chocolate cake recipe preparation process.

Steps:
1. Check if all ingredients are available
2. If missing ingredients, create shopping list
3. Preheat oven to 350°F (175°C)
4. Prepare baking pans with butter and flour
5. Mix dry ingredients in large bowl
6. Combine wet ingredients in separate bowl
7. Gradually combine wet and dry ingredients
8. Pour batter into prepared pans
9. Bake for 25-30 minutes until toothpick comes out clean
10. Cool cakes completely before frosting
11. Prepare chocolate frosting
12. Assemble and frost the cake
13. Serve and enjoy

Each step should include timing and temperature details where relevant.`,
        de: `Schokoladenkuchen-Rezept-Zubereitungsprozess.

Schritte:
1. Prüfen, ob alle Zutaten verfügbar sind
2. Bei fehlenden Zutaten, Einkaufsliste erstellen
3. Ofen auf 175°C vorheizen
4. Backformen mit Butter und Mehl vorbereiten
5. Trockene Zutaten in großer Schüssel mischen
6. Feuchte Zutaten in separater Schüssel vermengen
7. Feuchte und trockene Zutaten schrittweise kombinieren
8. Teig in vorbereitete Formen gießen
9. 25-30 Minuten backen, bis Zahnstocher sauber herauskommt
10. Kuchen vollständig abkühlen lassen vor dem Glasieren
11. Schokoladenglasur vorbereiten
12. Kuchen zusammensetzen und glasieren
13. Servieren und genießen

Jeder Schritt sollte relevante Zeit- und Temperaturangaben enthalten.`,
        ru: `Процесс приготовления шоколадного торта.

Шаги:
1. Проверить, доступны ли все ингредиенты
2. Если ингредиенты отсутствуют, создать список покупок
3. Разогреть духовку до 175°C
4. Подготовить формы для выпечки маслом и мукой
5. Смешать сухие ингредиенты в большой миске
6. Соединить влажные ингредиенты в отдельной миске
7. Постепенно соединить влажные и сухие ингредиенты
8. Вылить тесто в подготовленные формы
9. Выпекать 25-30 минут, пока зубочистка не выйдет чистой
10. Полностью остудить торты перед глазированием
11. Приготовить шоколадную глазурь
12. Собрать и покрыть торт глазурью
13. Подавать и наслаждаться

Каждый шаг должен включать детали времени и температуры, где это уместно.`
    }
};

// Load example function
function loadExample() {
    const exampleKey = document.getElementById('exampleSelect').value;
    if (!exampleKey) return;

    const lang = document.getElementById('languageSelect').value;
    const exampleText = EXAMPLES[exampleKey][lang];
    
    if (exampleText) {
        document.getElementById('processDescription').value = exampleText;
        saveToHistory();
    }
}