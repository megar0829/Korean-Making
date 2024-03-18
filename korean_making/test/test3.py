#-*- coding:utf-8 -*-
import urllib3
import json
import base64
from django.conf import settings
# openApiURL = "http://aiopen.etri.re.kr:8000/WiseASR/Pronunciation" # 영어
openApiURL = "http://aiopen.etri.re.kr:8000/WiseASR/PronunciationKor" # 한국어

accessKey = "80b58862-f942-4bad-b657-68543d863291"
audioFilePath = "wav_file/record11.wav"
languageCode = "korean"
script = "안녕하세요 이윤정입니다."

file = open(audioFilePath, "rb")
audioContents = base64.b64encode(file.read()).decode("utf8")
file.close()

requestJson = {   
    "argument": {
        "language_code": languageCode,
        # "script": script,
        "audio": audioContents
    }
}

http = urllib3.PoolManager()
response = http.request(
    "POST",
    openApiURL,
    headers={"Content-Type": "application/json; charset=UTF-8","Authorization": accessKey},
    body=json.dumps(requestJson)
)

print("[responseCode] " + str(response.status))
print("[responBody]")
print(str(response.data, "utf-8"))

'''
    response.data {
        "result":0,
        "return_type":"com.google.gson.internal.LinkedTreeMap",
        "return_object":{
            "recognized":"PRONUNCIATION_SCRIPT",
            "score":"1.915244"
            }
        }
    result : api 통신 결과 (성공: 0, 실패: -1)
    return_object : 발음평가 결과 JSON
        recognized : script
        score : 평가 점수 (1 ~ 5)
'''

