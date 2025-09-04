document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('translate-button');
    btn.addEventListener('click', function () {
        // send request to flask /translate endpoint
        fetch('/translate')
            .then(response => response.json())
            .then(data => {
                document.getElementById('message').textContent = data.message;
                document.getElementById('select-title').textContent = data.select_title;
                document.getElementById('genre-name').textContent = data.genre_name;
                document.getElementById('level-name').textContent = data.level_name;
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
            })
            .catch(error => console.error('error:', error));
    });

    const form = document.getElementById('select-form');
    form.addEventListener('submit', function (event) {
        const genreChecked = document.querySelector('input[name="genre"]:checked');
        const levelChecked = document.querySelector('input[name="level"]:checked');
        if (!genreChecked || !levelChecked) {
            event.preventDefault();
            const choice = document.getElementById('choice');
            choice.textContent = 'ジャンルとレベルの両方を選択してください。';
        }
    });
});