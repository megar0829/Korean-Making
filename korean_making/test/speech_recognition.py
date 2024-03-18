import os
import azure.cognitiveservices.speech as speechsdk


# Azure Speech Key - 이후 env 파일로 수정
SPEECH_KEY="e29ecf045ecf4b20b5898e2a22f63a9b"
SPEECH_REGION="eastus"

# def recognize_from_microphone():
#     # This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
#     speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)
#     speech_config.speech_recognition_language="ko-KR"

#     audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
#     speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

#     print("Speak into your microphone.")
#     speech_recognition_result = speech_recognizer.recognize_once_async().get()

#     if speech_recognition_result.reason == speechsdk.ResultReason.RecognizedSpeech:
#         print("Recognized: {}".format(speech_recognition_result.text))
#     elif speech_recognition_result.reason == speechsdk.ResultReason.NoMatch:
#         print("No speech could be recognized: {}".format(speech_recognition_result.no_match_details))
#     elif speech_recognition_result.reason == speechsdk.ResultReason.Canceled:
#         cancellation_details = speech_recognition_result.cancellation_details
#         print("Speech Recognition canceled: {}".format(cancellation_details.reason))
#         if cancellation_details.reason == speechsdk.CancellationReason.Error:
#             print("Error details: {}".format(cancellation_details.error_details))
#             print("Did you set the speech resource key and region values?")


    
    
# recognize_from_microphone()


# pronunciation_config = speechsdk.PronunciationAssessmentConfig( 
#     reference_text="", 
#     grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark, 
#     granularity=speechsdk.PronunciationAssessmentGranularity.Phoneme, 
#     enable_miscue=False) 
# pronunciation_config.enable_prosody_assessment() 
# pronunciation_config.enable_content_assessment_with_topic("greeting")


# speech_recognizer = speechsdk.SpeechRecognizer(
#         speech_config=speech_config, \
#         audio_config=audio_config)

# pronunciation_assessment_config.apply_to(speech_recognizer)
# speech_recognition_result = speech_recognizer.recognize_once()

# # The pronunciation assessment result as a Speech SDK object
# pronunciation_assessment_result = speechsdk.PronunciationAssessmentResult(speech_recognition_result)

# # The pronunciation assessment result as a JSON string
# pronunciation_assessment_result_json = speech_recognition_result.properties.get(speechsdk.PropertyId.SpeechServiceResponse_JsonResult)

# def pronunciation_assessment_from_microphone():
#     """Performs one-shot pronunciation assessment asynchronously with input from microphone.
#         See more information at https://aka.ms/csspeech/pa"""

#     # Creates an instance of a speech config with specified subscription key and service region.
#     # Replace with your own subscription key and service region (e.g., "westus").
#     config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)

#     # The pronunciation assessment service has a longer default end silence timeout (5 seconds) than normal STT
#     # as the pronunciation assessment is widely used in education scenario where kids have longer break in reading.
#     # You can adjust the end silence timeout based on your real scenario.
#     config.set_property(speechsdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, "3000")

#     reference_text = ""
#     pronunciation_config = speechsdk.PronunciationAssessmentConfig(
#         reference_text=reference_text,
#         grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
#         granularity=speechsdk.PronunciationAssessmentGranularity.Phoneme,
#         enable_miscue=True)
#     pronunciation_config.enable_prosody_assessment()

#     # Create a speech recognizer, also specify the speech language
#     recognizer = speechsdk.SpeechRecognizer(speech_config=config, language="ko-KR")
#     while True:
#         # Receives reference text from console input.
#         print('Enter reference text you want to assess, or enter empty text to exit.')
#         print('> ', end='')

#         try:
#             reference_text = input()
#         except EOFError:
#             break

#         if not reference_text:
#             break

#         pronunciation_config.reference_text = reference_text
#         pronunciation_config.apply_to(recognizer)

#         # Starts recognizing.
#         print('Read out "{}" for pronunciation assessment ...'.format(reference_text))

#         # Note: Since recognize_once() returns only a single utterance, it is suitable only for single
#         # shot evaluation.
#         # For long-running multi-utterance pronunciation evaluation, use start_continuous_recognition() instead.
#         result = recognizer.recognize_once_async().get()

#         # Check the result
#         if result.reason == speechsdk.ResultReason.RecognizedSpeech:
#             print('Recognized: {}'.format(result.text))
#             print('  Pronunciation Assessment Result:')

#             pronunciation_result = speechsdk.PronunciationAssessmentResult(result)
#             print('    Accuracy score: {}, Prosody score: {}, Pronunciation score: {}, Completeness score : {}, FluencyScore: {}'.format(
#                 pronunciation_result.accuracy_score, pronunciation_result.prosody_score, pronunciation_result.pronunciation_score,
#                 pronunciation_result.completeness_score, pronunciation_result.fluency_score
#             ))
#             print('  Word-level details:')
#             for idx, word in enumerate(pronunciation_result.words):
#                 print('    {}: word: {}, accuracy score: {}, error type: {};'.format(
#                     idx + 1, word.word, word.accuracy_score, word.error_type
#                 ))
#         elif result.reason == speechsdk.ResultReason.NoMatch:
#             print("No speech could be recognized")
#         elif result.reason == speechsdk.ResultReason.Canceled:
#             cancellation_details = result.cancellation_details
#             print("Speech Recognition canceled: {}".format(cancellation_details.reason))
#             if cancellation_details.reason == speechsdk.CancellationReason.Error:
#                 print("Error details: {}".format(cancellation_details.error_details))



def speech_recognize_once_from_file():
    """performs one-shot speech recognition with input from an audio file"""
    # <SpeechRecognitionWithFile>
    speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)
    audio_config = speechsdk.audio.AudioConfig(filename=weatherfilename)
    # Creates a speech recognizer using a file as audio input, also specify the speech language
    speech_recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config, language="ko-KR", audio_config=audio_config)

    # Starts speech recognition, and returns after a single utterance is recognized. The end of a
    # single utterance is determined by listening for silence at the end or until a maximum of 15
    # seconds of audio is processed. It returns the recognition text as result.
    # Note: Since recognize_once() returns only a single utterance, it is suitable only for single
    # shot recognition like command or query.
    # For long-running multi-utterance recognition, use start_continuous_recognition() instead.
    result = speech_recognizer.recognize_once()

    # Check the result
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        print("Recognized: {}".format(result.text))
    elif result.reason == speechsdk.ResultReason.NoMatch:
        print("No speech could be recognized: {}".format(result.no_match_details))
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("Speech Recognition canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print("Error details: {}".format(cancellation_details.error_details))
    # </SpeechRecognitionWithFile>

                

pronunciation_assessment_from_microphone()