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
                           LEVEL=backend.LEVEL)

# 翻訳
@app.route('/translate')
def translate():
    return jsonify({'message': 'Welcome to your learning assistant!',
                    'select_title': 'Select genre and level below'})


# 学習開始
@app.route('/start', methods=['POST'])
def start():
    genre_key = request.form['genre']
    level_key = request.form['level']
    genre = backend.GENRE[genre_key]
    level = backend.LEVEL[level_key]
    return render_template(
        "index.html",
        message="学習アシスタントへようこそ！",
        select_title="ジャンルとレベルを選択",
        choice=f"{genre}の{level}を選択しました。問題を出します。",
        GENRE=backend.GENRE,
        LEVEL=backend.LEVEL,
    )
    # return jsonify({'message': f'{genre}の{level}を選択しました。問題を出します。'})

# サーバーを開始
if __name__ == '__main__':
    app.run(debug=True)
