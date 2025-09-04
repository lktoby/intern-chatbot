# 簡単なFlaskアプリ
from flask import Flask, render_template, jsonify, request
import backend

# Flaskアプリを作る
app = Flask(__name__)

# ホームページの設定
@app.route('/', methods=['GET'])
def hello_world():
    return render_template('index.html', 
                           message='学習アシスタントへようこそ！',
                           select_title='ジャンルとレベルを選択',
                           GENRE=backend.GENRE,
                           LEVEL=backend.LEVEL,
                           genre_name='ジャンル',
                           level_name='レベル')

# 翻訳
@app.route('/translate')
def translate():
    return jsonify({'message': 'Welcome to your learning assistant!',
                    'select_title': 'Select genre and level below',
                    'GENRE': backend.GENRE_EN,
                    'LEVEL': backend.LEVEL_EN,
                    'genre_name': 'Genre',
                    'level_name': 'Level',})


# 学習開始
@app.route('/start', methods=['POST'])
def start():
    genre_key = request.form['genre']
    level_key = request.form['level']
    genre = backend.GENRE[genre_key]
    level = backend.LEVEL[level_key]

    system_prompt = backend.SYSTEM_PROMPT.format(GENRE=genre, LEVEL=level)
    backend.messages.clear()
    backend.messages.append({"role": "system", "content": system_prompt})
    question = backend.chat(
        f"{genre}の{level}から1つの選択問題を出してください。"
    )
    return render_template("chat.html", 
                           choice=f"{genre}の{level}",
                           question=question)

@app.route('/api/message', methods=['POST'])
def api_message():
    data = request.get_json()
    user_input = data.get('choices', '')
    reply = backend.chat(user_input)
    return jsonify({'reply': reply})

# サーバーを開始
if __name__ == '__main__':
    app.run(debug=True)
