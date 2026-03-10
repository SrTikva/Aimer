const API_KEY = 'AIzaSyDpgLNhiGQTxRx61haxk7fxhk0buJj_9Og';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const promptInput = document.querySelector('textarea');
const aiSelector = document.querySelector('select');

// Главная функция отправки
async function sendToGemini() {
    const promptText = promptInput.value.trim();

    // 1. Проверки перед отправкой
    if (!promptText) return; // Если пусто, ничего не делаем
    if (aiSelector.value !== 'gemini') {
        alert("Выбрана другая модель, логика для неё не настроена.");
        return;
    }

    console.log("Отправка промпта:", promptText);
    
    // Очищаем поле сразу после нажатия (как в мессенджерах)
    promptInput.value = '';
    promptInput.style.height = 'auto'; 

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        const data = await response.json();
        
        // Проверка на ошибки в ответе API
        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Выводим результат (можно заменить на отрисовку в HTML)
        console.log("Gemini:", aiResponse);
        alert("Ответ Gemini: " + aiResponse);

    } catch (error) {
        console.error("Произошла ошибка:", error);
        alert("Ошибка при запросе к API.");
    }
}

// Обработка клавиш в textarea
promptInput.addEventListener('keydown', (e) => {
    // Если нажата Enter БЕЗ Shift
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // ОТМЕНЯЕМ перенос строки
        sendToGemini();     // Запускаем отправку
    }
});

