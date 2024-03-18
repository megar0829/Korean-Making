from django.conf import settings
import json
from rest_framework.response import Response
import urllib3
openApiURL = "http://aiopen.etri.re.kr:8000/ParaphraseQA"
accessKey = ""
print('##########################')
print(accessKey)
sentence1 = "날씨가 어때요?"
sentence2 = "날씨가 어때?"

requestJson = {
"argument": {
    "sentence1": sentence1 ,
    "sentence2": sentence2 
    }
}

http = urllib3.PoolManager()
response = http.request(
    "POST",
    openApiURL,
    headers={"Content-Type": "application/json; charset=UTF-8","Authorization" :  accessKey},
    body=json.dumps(requestJson)
)

print("[responseCode] " + str(response.status))
print("[responBody]")
print(str(response.data,"utf-8"))