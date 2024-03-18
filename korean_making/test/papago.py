import requests
import json

CLIENT_ID = 'ViMD_xyTcqBhcvve8H6U'
CLIENT_SECRET = 'seyPgGa7BN'
SOURCE = 'en'
TARGET = 'ko'

text = 'ddd'
url = 'https://openapi.naver.com/v1/papago/n2mt'
headers = {
    'Content-Type': 'application/json',
    'X-Naver-Client-Id': CLIENT_ID,
    'X-Naver-Client-Secret': CLIENT_SECRET
}
data = {'source': SOURCE, 'target': TARGET, 'text': text}

response = requests.post(url, json.dumps(data), headers=headers)

en_text = response.json()['message']['result']['translatedText']
print(en_text)