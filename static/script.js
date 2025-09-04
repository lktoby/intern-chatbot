document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('choice-form');
    const nextBtn = document.getElementById('next-button');
    const endBtn = document.getElementById('end-button');

    const aiContent = document.getElementById('ai-content');
    if (window.MathJax) {
        MathJax.typeset();
    }
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
                if (text === 'next') {
                    const jsonString = data.reply; 
                    const obj = JSON.parse(jsonString);
                    const questionText = obj.question;
                    const next_question = document.getElementById('ai-content');
                    next_question.innerHTML = questionText;
                    if (window.MathJax) {
                        MathJax.typeset();
                    }
                } else {
                    obj = JSON.parse(data.reply);
                    const resultText = obj.result;
                    const explanation = obj.explanation;
                    const result = document.getElementById('ai-result');
                    result.textContent = resultText + "\n" + explanation;
                    result.innerHTML = result.textContent.replace(/\n/g, '<br>');
                    if (window.MathJax) {
                        MathJax.typeset();
                    }
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