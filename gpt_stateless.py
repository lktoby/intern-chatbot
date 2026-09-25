import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

def chat_once(message: str) -> str:
    openai_api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=openai_api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": message}],
    )
    return response.choices[0].message.content

def main():
    while True:
        prompt = input("プロンプトを入力してください(endと入力して終了)：")
        if prompt == "end":
            print("終了します")
            return
        else:
            reply = chat_once(prompt)
            print("gpt:", reply)

if __name__ == "__main__":
    main()
