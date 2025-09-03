document.addEventListener('DOMContentLoaded', function () {
   const btn = document.getElementById('translate-button');
    btn.addEventListener('click', function () {
        // send request to flask /translate endpoint
        fetch('/translate')
            .then(response => response.json())
            .then(data => {
                document.getElementById('message').textContent = data.message;
            })
            .catch(error => console.error('エラー:', error));
    });
});