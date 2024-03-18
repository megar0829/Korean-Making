#-*- coding:utf-8 -*-
import urllib3
import json
import openai

openai.api_key = ""
messages = []
while True:
    content = input("User: ")
    messages.append({"role": "user", "content": content})

    completion = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = messages
    )

    chat_response = completion.choices[0].message.content
    print(f'ChatGPT: {chat_response}')
    messages.append({"role": "assistant", "content": chat_response})