document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('translate-button');
    let isEnglish = false;
    btn.addEventListener('click', function () {
        document.getElementById('choice').textContent = '';
        const endpoint = isEnglish ? '/translate_ja' : '/translate';
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                document.getElementById('message').textContent = data.message;
                document.getElementById('select-title').textContent = data.select_title;
                document.getElementById('genre-name').textContent = data.genre_name;
                document.getElementById('level-name').textContent = data.level_name;
                document.getElementById('reset-button').textContent = isEnglish ? 'クリア' : 'clear';
                const genreLabels = document.querySelectorAll('input[name="genre"]');
                Object.values(data.GENRE).forEach((label, i) => {
                    if (genreLabels[i].nextSibling && genreLabels[i].nextSibling.nodeType === Node.TEXT_NODE) {
                        genreLabels[i].nextSibling.nodeValue = ' ' + label;
                    }
                });
                const levelLabels = document.querySelectorAll('input[name="level"]');
                Object.values(data.LEVEL).forEach((label, i) => {
                    if (levelLabels[i].nextSibling && levelLabels[i].nextSibling.nodeType === Node.TEXT_NODE) {
                        levelLabels[i].nextSibling.nodeValue = ' ' + label;
                    }
                });
                isEnglish = !isEnglish;
                btn.textContent = isEnglish ? '日本語' : 'english';
            })
            .catch(error => console.error('error:', error));
    });

    const form = document.getElementById('select-form');
    form.addEventListener('submit', function (event) {
        choice.textContent = '';
        const genreChecked = document.querySelector('input[name="genre"]:checked');
        const levelChecked = document.querySelector('input[name="level"]:checked');
        if (!genreChecked || !levelChecked) {
            event.preventDefault();
            const choice = document.getElementById('choice');
            choice.textContent = isEnglish
            ? 'Please select both genre and level.'
            : 'ジャンルとレベルを両方選択してください。';
        }
    });

    const reset = document.getElementById('reset-button');
    reset.addEventListener('click', function () {
        const genreRadios = document.querySelectorAll('input[name="genre"]');
        genreRadios.forEach(radio => radio.checked = false);
        const levelRadios = document.querySelectorAll('input[name="level"]');
        levelRadios.forEach(radio => radio.checked = false);
    });
});