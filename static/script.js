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
        renderChoices(obj.choices);
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
                    renderChoices(obj.choices);
                } else if (text === 'end') { 
                    const obj = JSON.parse(data.reply);
                    const accuracy = obj.accuracy;
                    const total_questions = obj.total_questions;
                    const correct_answers = obj.correct_answers;
                    const overall_evaluation = obj.overall_evaluation;
                    const strengths = obj.strengths;
                    const improvements = obj.improvements;
                    const advice = obj.advice;
                    const end = document.getElementById('ai-content');
                    end.textContent = `正答率：${accuracy} 正解数：${correct_answers} 総問題数：${total_questions}\n
                    総合評価：${overall_evaluation}\n
                    良い点：${strengths}\n
                    改善点：${improvements}\n
                    学習のアドバイス：${advice}`;
                    end.innerHTML = end.textContent.replace(/\n/g, '<br>');
                    const form = document.getElementById('choice-form');
                    form.innerHTML = '';
                    const result = document.getElementById('ai-result');
                    result.innerHTML = '';
                    const buttons = document.getElementById('buttons');
                    buttons.innerHTML = '';
                }
                else {
                const obj = JSON.parse(data.reply);
                const resultText = obj.result;
                const explanation = obj.explanation;
                console.log('Received response:', resultText, explanation);
                const result = document.getElementById('ai-result');
                result.textContent = resultText + "\n" + explanation;
                result.innerHTML = result.textContent.replace(/\n/g, '<br>');
                if (window.MathJax) {
                    MathJax.typeset();  
                }
                }
            });
    }

    function renderChoices(choices) {
        const form = document.getElementById('choice-form');
        form.innerHTML = '';
        choices.forEach((choice, idx) => {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'choices';
            radio.value = idx + 1;
            radio.id = `choice${idx + 1}`;
            const label = document.createElement('label');
            label.htmlFor = radio.id;
            label.textContent = ` ${typeof choice === 'object' ? JSON.stringify(choice) : String(choice)}`;
            console.log('Rendering choice:', typeof choice === 'object' ? JSON.stringify(choice) : choice);
            form.appendChild(radio);
            form.appendChild(label);
            form.appendChild(document.createElement('br'));
        });
        const submit = document.createElement('input');
        submit.type = 'submit';
        submit.value = 'send';
        form.appendChild(submit);
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