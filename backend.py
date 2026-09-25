import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

GENRE = {'1': '数学', '2': '英語', '3': '理科', '4': 'IT全般', '5': 'AI（人工知能）', '6': 'Python'}
GENRE_EN = {'1': 'Math', '2': 'English', '3': 'Science', '4': 'IT', '5': 'AI', '6': 'Python'}
LEVEL = {'1': '初心者（小学生レベル）', '2': '中級者（中学生レベル）', '3': '上級者（高校～大学レベル）'}
LEVEL_EN = {'1': 'Beginner', '2': 'Intermediate', '3': 'Advanced'}

SYSTEM_PROMPT = """
問題を出し回答の結果を評価せよ

### 流れ 
1. {GENRE}から{LEVEL}の問題を1つ生成する 
2. 選択したジャンルとレベルを基づいた問題を1つ出題する 
3. 問題文と回答候補の選択肢5つを表示する 
4. 選択しの番号を（1. 2. 3. 4. 5.）で選ぶ 
5. 正解・不正解の判定と解説文を表示する  

#### 各ジャンルの解説
- 数学：算数、代数、幾何、確率、統計などの分野から出題する
- 英語：文法、語彙、読解などの分野から出題する
- 理科：物理、化学、生物、地学などの分野から出題する
- IT全般：コンピュータの基礎、ネットワーク、セキュリティなどの分野から出題する
- AI（人工知能）：機械学習、深層学習、自然言語処理などの分野から出題する
- Python：Pythonのプログラミングに関する基礎から応用までの分野から出題する

### 制限 
- 数式をlatex表記を使ってきれいに表示すること 
- 問題は人間で電卓を使わずに解けるようにすること（例：平方根などは無限小数しないようにすること） 
- 解説文は200文字までにすること
- 出力の最後にユーザにの入力を促すような文章は表示しないこと

### 指示 （出力に表示しないこと）
- nextと指示したら次の問題を出す 
- newと指示したらジャンルとレベルの再指定ができる 
- endと指示したらこれまでの問題に対する回答を基づいた総合評価として以下の表示を行う：
 　- 正答率、総問題数、正解数
 　- 総合評価文（300文字以内）
 　- 良い点を2つ（1つの点は50字以内、箇条書きで表示）
 　- 改善点を2つ（1つの点は50字以内、箇条書きで表示）
 　- これからの学習アドバイス（200文字以内、2つを箇条書きで表示）

 ### 出力形式
 必ず以下のJSON形式で回答してください。JSON形式以外のテキストは含めないでください。
 また、問題文や解説文にHTMLで表示できるように改行タグやリストタグを含めても構いません。しかし、JSON形式が崩れないように注意してください。

 #### 問題出題時
 {{
 "type": "question", 
 "question": "問題文", 
 "choices": [{{"選択肢1", "選択肢2", "選択肢3", "選択肢4", "選択肢5"}}],
 "answer": "正解の番号（1~5）"
 }}

 #### 回答評価時
 {{
 "type": "check",
 "result": "正解/不正解",
 "explanation": "解説文"
 }}

 #### 総合評価時 (end指示時)
 {{
 "type": "summary",
 "accuracy": "正答率（%）",
 "total_questions": "総問題数",
 "correct_answers": "正解数",
 "overall_evaluation": "総合評価文",
 "strengths": ["良い点1", "良い点2"],
 "improvements": ["改善点1", "改善点2"],
 "advice": ["学習アドバイス1", "学習アドバイス2"]
 }}

 ### 注意点
 必ずJSON形式で出力すること。JSON形式以外のテキストは一切含めないこと。
 プロパティ・値ともにダブルクォート("")で囲むこと。
 選択しの番号のみを回答として受け付けること。
 1つの問題に対して複数の回答を受け付けないこと。
"""
messages = [{
    "role": "system",
    "content": SYSTEM_PROMPT
}]

def chat(message: str) -> str:
    messages.append({"role": "user", "content": message})
    openai_api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=openai_api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )
    reply = response.choices[0].message.content
    messages.append({"role": "assistant", "content": reply})
    return reply

def main():
    q_count = 0
    print("学習アシスタントへようこそ。")
    while True:
        print("学習したいジャンルを選んでください。")
        for key, value in GENRE.items():
            print(f"{key}: {value}")
        while True:
            genre = input("学習したいジャンルの番号を入力してください。（endと入力して終了）\n> ")
            if genre in GENRE:
                break
            elif genre == "end":
                reply = chat("end")
                print(reply)
                return
            else:
                print("無効な入力です。もう一度入力してください。")
        print(f"{GENRE[genre]}を選択しました。次にレベルを選んでください。")
        for key, value in LEVEL.items():
            print(f"{key}: {value}")
        while True:
            level = input("学習したいレベルの番号を入力してください。（endと入力して終了）\n> ")
            if level in LEVEL:
                break
            elif level == "end":
                reply = chat("end")
                print(reply)
                return
            else:
                print("無効な入力です。もう一度入力してください。")
        print(f"{GENRE[genre]}の{LEVEL[level]}を選択しました。問題を出します。")
        while True:
            print(f"{q_count+1}問目")
            input_prompt = f"{GENRE[genre]}の{LEVEL[level]}から1つの選択問題を出してください。"
            reply = chat(input_prompt)
            print(reply)
            answer_prompt = input("回答の番号を入力してください。\n> ")
            reply = chat(answer_prompt)
            print(reply)
            if (q_count + 1) >= 5:
                print("学習が終了しました。総合評価を表示します。")
                reply = chat("end")
                print(reply)
                return
            else:
                q_count += 1
            next = input("次の問題に進む場合はnext、ジャンルとレベルを再指定する場合はnew、終了する場合はendを入力してください。\n> ")
            if next == "next":
                continue
            elif next == "new":
                q_count = 0
                break
            elif next == "end":
                reply = chat("end")
                print(reply)
                return
            else:
                print("無効な入力です。もう一度入力してください。")
                while True:
                    next = input("次の問題に進む場合はnext、ジャンルとレベルを再指定する場合はnew、終了する場合はendを入力してください。\n> ")
                    if next == "next":
                        break
                    elif next == "new":
                        q_count = 0
                        break
                    elif next == "end":
                        reply = chat("end")
                        print(reply)
                        return
                    else:
                        print("無効な入力です。もう一度入力してください。")

if __name__ == "__main__":
    main()
