#簡単なFlaskアプリ
from flask import Flask, render_template

#Flaskアプリを作る
app = Flask(__name__)

#ホームページの設定
@app.route('/')
def hello_world():
    return render_template('index.html', message='hello world')

#サーバーを開始
if __name__ == '__main__':
    app.run(debug=True)