document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('choice-form');
    const nextBtn = document.getElementById('next-button');
    const endBtn = document.getElementById('end-button');

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
                if (text === 'next') {
                    const next_question = document.getElementById('ai-content');
                    next_question.textContent = data.reply;
                } else {
                    const result = document.getElementById('ai-result');
                    result.textContent = data.reply;
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