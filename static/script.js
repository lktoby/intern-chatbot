document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('choice-form');
    const nextBtn = document.getElementById('next-button');
    const endBtn = document.getElementById('end-button');

    const aiContent = document.getElementById('ai-content');
    try {
        const obj = JSON.parse(aiContent.textContent);
        aiContent.textContent = obj.question;
    } catch (e) {
        console.log(e)
    }

    function sendMessage(text) {
        console.log('Sending message:', text);
        const response = fetch('/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ choices: text })
        })
            .then(response => response.json())
            .then(data => { 
                // 例: AIの返答がJSON文字列の場合
                const jsonString = data.reply; // 例: '{"type":"question","question":"問題文","choices":["A","B","C","D","E"],"answer":"1"}'
                const obj = JSON.parse(jsonString);
                const questionText = obj.question;
                if (text === 'next') {
                    const next_question = document.getElementById('ai-content');
                    next_question.textContent = questionText;
                } else {
                    const result = document.getElementById('ai-result');
                    result.textContent = questionText;
                }
            });
    }

    form.addEventListener('submit', function (event) {
            event.preventDefault();
            const input = document.querySelector('input[name="choices"]:checked').value;
            if (input) {
                sendMessage(input);
            }
            const radios = document.querySelectorAll('input[name="choices"]');
            radios.forEach(radio => radio.checked = false);
        });
    nextBtn.addEventListener('click', function (event) {
        sendMessage('next');
        const result = document.getElementById('ai-result');
        result.textContent = '';
    });
    endBtn.addEventListener('click', () => sendMessage('end'));
    
});