let API_KEY;
let URL ;

const promptInput = document.querySelector('textarea');
const aiSelector = document.querySelectorAll('select');
let answerAI = document.querySelector('h3');

// Главная функция отправки
async function sendToGemini() {
    const promptText = promptInput.value.trim();
    
    if (aiSelector.value =='chatGPT'){
        API_KEY = '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';
        URL = "https://api.openai.com/v1";
    }

    else if(aiSelector.value == 'gemini'){
        API_KEY = 'AIzaSyC2O_uQWz9ndM3vgnNHEScdUVaZl0weLfU';
        URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    }

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
        console.log(aiSelector.value+":", aiResponse);
        answerAI.innerHTML = aiSelector.value+":",aiResponse;

    } catch (error) {
        console.error("Произошла ошибка:", error);
        answerAI.innerHTML = "Произошла ошибка";
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

