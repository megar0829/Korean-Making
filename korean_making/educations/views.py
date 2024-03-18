from django.shortcuts import render
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.decorators import login_required
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.contrib.auth import get_user_model
import openai
import random
from .models import Sentence, WritingRecord, SpeakingRecord
from .serializers import SentenceSerializer, EnSentenceSerializer, KoSentenceSerializer, WritingRecordSerializer, SpeakingRecordSerializer
from accounts.models import Profile

#-*- coding:utf-8 -*-import urllib3import jsonfrom .models import Sentence
import base64
import requests
import pyaudio
import wave
from urllib3 import Timeout, PoolManager
import json
import random
import time

from rest_framework.views import APIView
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


import azure.cognitiveservices.speech as speechsdk
import time
import string

import os
import difflib

import pyaudio
import wave

# 발음 평가
import azure.cognitiveservices.speech as speechsdk
import time
import string

import os



class AudioUploadView(APIView):
    def post(self, request, format=None):
        audio_file = request.FILES.get("audio")

        if audio_file:
            unique_filename = default_storage.get_available_name(audio_file.name)
            audio_path = default_storage.save(f"audio/{unique_filename}", ContentFile(audio_file.read()))
            
            print(audio_path)

            return Response({"message": "Audio file uploaded successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "No audio file provided"}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import permission_classes


def pronunciation_assessment_continuous_from_file(wav_file_name, input_script):
    SPEECH_KEY=settings.SPEECH_KEY
    SPEECH_REGION="eastus"
    """Performs continuous pronunciation assessment asynchronously with input from an audio file.
        See more information at https://aka.ms/csspeech/pa"""

    import difflib
    import json
    print('**', input_script)
    # Creates an instance of a speech config with specified subscription key and service region.
    # Replace with your own subscription key and service region (e.g., "westus").
    # Note: The sample is for en-US language.
    speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)
    audio_config = speechsdk.audio.AudioConfig(filename=wav_file_name)

    reference_text = input_script
    # Create pronunciation assessment config, set grading system, granularity and if enable miscue based on your requirement.
    enable_miscue = True
    enable_prosody_assessment = True
    pronunciation_config = speechsdk.PronunciationAssessmentConfig(
        reference_text=reference_text,
        grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
        granularity=speechsdk.PronunciationAssessmentGranularity.Phoneme,
        enable_miscue=enable_miscue)
    if enable_prosody_assessment:
        pronunciation_config.enable_prosody_assessment()

    # Creates a speech recognizer using a file as audio input.
    language = 'ko-KR' # 지원 언어
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, language=language, audio_config=audio_config)
    # Apply pronunciation assessment config to speech recognizer
    pronunciation_config.apply_to(speech_recognizer)

    done = False
    recognized_words = []
    prosody_scores = []
    fluency_scores = []
    durations = []

    def stop_cb(evt: speechsdk.SessionEventArgs):
        """callback that signals to stop continuous recognition upon receiving an event `evt`"""
        print('CLOSING on {}'.format(evt))
        nonlocal done
        done = True

    def recognized(evt: speechsdk.SpeechRecognitionEventArgs):
        print("pronunciation assessment for: {}".format(evt.result.text))
        pronunciation_result = speechsdk.PronunciationAssessmentResult(evt.result)
        print("    Accuracy score: {}, prosody score: {}, pronunciation score: {}, completeness score : {}, fluency score: {}".format(
            pronunciation_result.accuracy_score, pronunciation_result.prosody_score, pronunciation_result.pronunciation_score,
            pronunciation_result.completeness_score, pronunciation_result.fluency_score
        ))
        nonlocal recognized_words, prosody_scores, fluency_scores, durations
        recognized_words += pronunciation_result.words
        fluency_scores.append(pronunciation_result.fluency_score)
        if pronunciation_result.prosody_score is not None:
            prosody_scores.append(pronunciation_result.prosody_score)
        json_result = evt.result.properties.get(speechsdk.PropertyId.SpeechServiceResponse_JsonResult)
        jo = json.loads(json_result)
        nb = jo["NBest"][0]
        durations.append(sum([int(w["Duration"]) for w in nb["Words"]]))

    # Connect callbacks to the events fired by the speech recognizer
    speech_recognizer.recognized.connect(recognized)
    speech_recognizer.session_started.connect(lambda evt: print('SESSION STARTED: {}'.format(evt)))
    speech_recognizer.session_stopped.connect(lambda evt: print('SESSION STOPPED {}'.format(evt)))
    speech_recognizer.canceled.connect(lambda evt: print('CANCELED {}'.format(evt)))
    # Stop continuous recognition on either session stopped or canceled events
    speech_recognizer.session_stopped.connect(stop_cb)
    speech_recognizer.canceled.connect(stop_cb)

    # Start continuous pronunciation assessment
    speech_recognizer.start_continuous_recognition()
    while not done:
        time.sleep(.5)

    speech_recognizer.stop_continuous_recognition()

    # We need to convert the reference text to lower case, and split to words, then remove the punctuations.
    if language == 'zh-CN':
        # # Use jieba package to split words for Chinese
        # import jieba
        # import zhon.hanzi
        # jieba.suggest_freq([x.word for x in recognized_words], True)
        # reference_words = [w for w in jieba.cut(reference_text) if w not in zhon.hanzi.punctuation]
        pass
    else:
        reference_words = [w.strip(string.punctuation) for w in reference_text.lower().split()]

    if enable_miscue:
        diff = difflib.SequenceMatcher(None, reference_words, [x.word.lower() for x in recognized_words])
        final_words = []
        for tag, i1, i2, j1, j2 in diff.get_opcodes():
            if tag in ['insert', 'replace']:
                for word in recognized_words[j1:j2]:
                    if word.error_type == 'None':
                        word._error_type = 'Insertion'
                    final_words.append(word)
            if tag in ['delete', 'replace']:
                for word_text in reference_words[i1:i2]:
                    word = speechsdk.PronunciationAssessmentWordResult({
                        'Word': word_text,
                        'PronunciationAssessment': {
                            'ErrorType': 'Omission',
                        }
                    })
                    final_words.append(word)
            if tag == 'equal':
                final_words += recognized_words[j1:j2]
    else:
        final_words = recognized_words

    # We can calculate whole accuracy by averaging
    final_accuracy_scores = []
    for word in final_words:
        if word.error_type == 'Insertion':
            continue
        else:
            final_accuracy_scores.append(word.accuracy_score)
    accuracy_score = sum(final_accuracy_scores) / len(final_accuracy_scores)
    # Re-calculate the prosody score by averaging
    if len(prosody_scores) == 0:
        prosody_score = float("nan")
    else:
        prosody_score = sum(prosody_scores) / len(prosody_scores)
    # Re-calculate fluency score
    fluency_score = sum([x * y for (x, y) in zip(fluency_scores, durations)]) / sum(durations)
    # Calculate whole completeness score
    completeness_score = len([w for w in recognized_words if w.error_type == "None"]) / len(reference_words) * 100
    completeness_score = completeness_score if completeness_score <= 100 else 100

    # accuracy_score 만 사용
    print('    Paragraph accuracy score: {}, prosody score: {}, completeness score: {}, fluency score: {}'.format(
        accuracy_score, prosody_score, completeness_score, fluency_score
    ))

    for idx, word in enumerate(final_words):
        print('    {}: word: {}\taccuracy score: {}\terror type: {};'.format(
            idx + 1, word.word, word.accuracy_score, word.error_type
        ))
    
    return accuracy_score


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def speaking(request):
    if request.method == 'GET':
        sentence = Sentence.objects.all()
        serializer = KoSentenceSerializer(sentence, many=True)

        return Response(serializer.data)
    
    elif request.method == 'POST':  
        input_script = request.data['input_script']
        CHUNK = 1024
        FORMAT = pyaudio.paInt16
        CHANNELS = 1
        RATE = 16000
        RECORD_SECONDS = int(len(input_script.replace(' ', '')) // 2)
        WAVE_OUTPUT_FILENAME = f"record_{request.user}.wav"

        p = pyaudio.PyAudio()

        stream = p.open(format=FORMAT,
                        channels=CHANNELS,
                        rate=RATE,
                        input=True,
                        frames_per_buffer=CHUNK)

        print("Start to record the audio.")

        frames = []

        for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
            data = stream.read(CHUNK)
            frames.append(data)

        print("Recording is finished.")
        stream.stop_stream()
        stream.close()
        p.terminate()

        wf = wave.open(f'wav_file/{WAVE_OUTPUT_FILENAME}', 'wb')
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))
        wf.close()
        
        # 현재 디렉토리의 절대 경로 가져오기
        script_dir = os.path.dirname(os.path.abspath(__file__))

        # 상대 경로를 사용하여 파일 경로 생성
        wav_file_name = os.path.join(script_dir,'..','wav_file', WAVE_OUTPUT_FILENAME)
        
        try:
            accuracy_score = pronunciation_assessment_continuous_from_file(wav_file_name, input_script)
        
            # 점수 계산    
            score = int(((accuracy_score - 50) / 50) * 100)
            if score < 0:
                score = 0
            exp = score * 0.1
        except:
            score = 0
            exp = 0
        
        speaking_record = SpeakingRecord()

        profile = Profile.objects.get(user=request.user)
        profile.exp += exp 
        profile.save()


        speaking_record.score = score
        speaking_record.audio = wav_file_name
        speaking_record.input_script = input_script
        speaking_record.user = request.user
        speaking_record.save()
    
        serializer = SpeakingRecordSerializer(speaking_record)

        # speaking record 저장
        return Response(serializer.data)
        

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def writing(request):
    if request.method == 'GET':        
        sentence = Sentence.objects.all()
        serializer = EnSentenceSerializer(sentence, many=True)
        return Response(serializer.data)
             

    elif request.method == 'POST':
        # 영어 문장, 한국어 문장 입력받기
        # input_sentence : 사용자가 입력한 한국어 문장
        input_sentence = request.data.get('input_sentence')

        is_invalid = True
        for s in input_sentence:
            if '가' <= s <= '힣':
                is_invalid = False
                break
        
        if is_invalid:
            return Response(data={'error': '한국어 문장을 입력해 주세요.'}, status=status.HTTP_404_NOT_FOUND)

        # 추천 문장인 경우 or 입력한 경우
        en_sentence = request.data.get('en_sentence')
        
        is_saved = True
        # 저장된 영어 문장이 아니라면 번역 후 저장 (레코드랑 센텐스)
        if not Sentence.objects.filter(en_sentence=en_sentence).exists():
            is_saved = False
            print(is_saved)
            
            CLIENT_ID = settings.CLIENT_ID
            CLIENT_SECRET = settings.CLIENT_SECRET
            SOURCE = 'en'
            TARGET = 'ko'
            url = 'https://openapi.naver.com/v1/papago/n2mt'
            headers = {
                'Content-Type': 'application/json',
                'X-Naver-Client-Id': CLIENT_ID,
                'X-Naver-Client-Secret': CLIENT_SECRET
            }

            data = {'source': SOURCE, 'target': TARGET, 'text': en_sentence}

            tran_response = requests.post(url, json.dumps(data), headers=headers)

            # 번역된 한글 문장
            ko_sentence = tran_response.json()['message']['result']['translatedText']
            
            sentence = Sentence()
            sentence.en_sentence = en_sentence
            sentence.ko_sentence = ko_sentence       
            sentence.save()

        # 이미 있는 문장이면 그냥 저장 (레코드)
        else:
            sentence = Sentence.objects.get(en_sentence=en_sentence)

        # 입력 받은 영어 문장을 번역한 한국어 문장
        ko_answer = sentence.ko_sentence
        
        # 두 문장의 유사도 판단
        # 두 문장 패러프라이즈 인식 (ko_answer(정답), ko_sentence(사용자 입력))
        openApiURL = "http://aiopen.etri.re.kr:8000/ParaphraseQA"
        ETRI_API_KEY = settings.ETRI_API_KEY

        requestJson = {
        "argument": {
            "sentence1": ko_answer,
            "sentence2": input_sentence 
            }
        }
        
        http = PoolManager()
        para_response = http.request(
            "POST",
            openApiURL,
            headers = {"Content-Type": "application/json; charset=UTF-8", "Authorization": ETRI_API_KEY},
            body = json.dumps(requestJson)
        )
        
        # 패러프레이즈 결과
        result = para_response.json().get('return_object').get('result').rstrip('')
        
        exp = 0 
        print(is_saved)
        if result == "paraphrase":
            score = True
            if is_saved:
                exp = 50
            else:
                exp = 10
            
        elif result == "not paraphrase":
            score = False
        
        # 결과 기록(Writing Record)
        record = WritingRecord()
        record.user = request.user
        record.recommend = sentence
        record.score = score
        record.input_sentence = input_sentence
        record.save()

        profile = Profile.objects.get(user=request.user)
        profile.exp += exp 
        profile.save()

        # 사용자 경험치 기록(exp)
        serializer = WritingRecordSerializer(record)
        
        return Response(serializer.data)