from rest_framework import serializers
from .models import SpeakingRecord, WritingRecord, Sentence
from django.contrib.auth import get_user_model


# class SpeakingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Speaking
#         fields = '__all__'
#         read_only_fields = ('username',)

# # username, score, date, content, ans
# class WritingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Writing
#         fields = '__all__'
#         read_only_fields = ('username',)


class SpeakingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeakingRecord
        fields = '__all__'
        

class KoSentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sentence
        fields = ('ko_sentence',)
        
        
class EnSentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sentence
        fields = ('en_sentence',)


class SentenceSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Sentence
        fields = '__all__'


class WritingRecordSerializer(serializers.ModelSerializer):
    recommend = SentenceSerializer()

    class Meta:
        model = WritingRecord
        fields = '__all__'