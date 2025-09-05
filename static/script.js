document.addEventListener('DOMContentLoaded', function () {
    function formatCodeSnippets(text) {
        // 3つのバッククォート（コードブロック）
        text = text.replace(/```(?:\w+)?\n?([\s\S]*?)```/g, function(match, code) {
            return '<pre><code>' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
        });
        // 1つのバッククォート（インラインコード）
        text = text.replace(/`([^`]+?)`/g, function(match, code) {
            return '<code>' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code>';
        });
        return text;
    }

    const form = document.getElementById('choice-form');
    const nextBtn = document.getElementById('next-button');
    const endBtn = document.getElementById('end-button');

    const aiContent = document.getElementById('ai-content');
    if (window.MathJax) {
        MathJax.typeset();
    }
    try {
        const obj = JSON.parse(aiContent.textContent);
        aiContent.innerHTML = formatCodeSnippets(obj.question);
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
                    next_question.innerHTML = formatCodeSnippets(questionText);
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
                    let summaryText = `正答率：${accuracy} <br>
                    正解数：${correct_answers} <br>
                    総問題数：${total_questions}<br>
                    総合評価：${overall_evaluation}<br>
                    良い点：${strengths}<br>
                    改善点：${improvements}<br>
                    学習のアドバイス：${advice}`;
                    end.innerHTML = formatCodeSnippets(summaryText);
                    const form = document.getElementById('choice-form');
                    form.innerHTML = '';
                    const result = document.getElementById('ai-result');
                    result.innerHTML = '';
                    const buttons = document.getElementById('buttons');
                    buttons.innerHTML = '<button id="back-button" onclick="location.href=\'/\'">back</button>';
                }
                else {
                const obj = JSON.parse(data.reply);
                const resultText = obj.result;
                const explanation = obj.explanation;
                console.log('Received response:', resultText, explanation);
                const result = document.getElementById('ai-result');
                const formatted = resultText
                    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                result.innerHTML = `<h4 style="color:darkgreen; font-weight:bold">${formatCodeSnippets(formatted)}</h4><br>${formatCodeSnippets(explanation)}`;
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
            const choiceText = typeof choice === 'object' ? Object.values(choice)[0] : String(choice);
            label.innerHTML = ' ' + formatCodeSnippets(choiceText);
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
        const selected = document.querySelector('input[name="choices"]:checked');
        const errorMsg = document.getElementById('choice-error');
        if (errorMsg) errorMsg.remove();
        if (selected) {
            sendMessage(selected.value);
        } else {
            // エラーメッセージを表示
            const formParent = form.parentNode;
            const error = document.createElement('p');
            error.id = 'choice-error';
            error.style.color = 'red';
            error.textContent = '選択肢を選んでください。';
            formParent.insertBefore(error, form.nextSibling);
        }
        });
    nextBtn.addEventListener('click', function (event) {
        sendMessage('next');
        const radios = document.querySelectorAll('input[name="choices"]');
        radios.forEach(radio => radio.checked = false);
        const result = document.getElementById('ai-result');
        result.textContent = '';
    });
    endBtn.addEventListener('click', () => sendMessage('end'));
    
});