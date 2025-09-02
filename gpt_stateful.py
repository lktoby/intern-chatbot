import os
from openai import OpenAI

system_prompt = """
あなたは小学校の理科教師です。私の質問に答えてください。
"""
messages = [
    {"role": "system",
    "content": system_prompt}
]

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
    print("私は理科の先生です。なんでも質問してください。（endと入力して終了）")
    while True:
        prompt = input("> ")
        if prompt == "end":
            print("終了します")
            return
        else:
            reply = chat(prompt)
            print("gpt:", reply)

if __name__ == "__main__":
    main()
