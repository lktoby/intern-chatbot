document.addEventListener('DOMContentLoaded', function () {
   const btn = document.getElementById('translate-button');
    btn.addEventListener('click', function () {
        // send request to flask /translate endpoint
        fetch('/translate')
            .then(response => response.json())
            .then(data => {
                document.getElementById('message').textContent = data.message;
                document.getElementById('select-title').textContent = data.select_title;
            })
            .catch(error => console.error('error:', error));
    });
});