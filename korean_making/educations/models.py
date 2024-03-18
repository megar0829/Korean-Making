from django.db import models
from django.conf import settings


class Sentence(models.Model):
    ko_sentence = models.CharField(max_length=250)
    en_sentence = models.CharField(max_length=250)

class WritingRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='writing')
    recommend = models.ForeignKey(Sentence, on_delete=models.CASCADE)
    input_sentence = models.CharField(max_length=250)
    score = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
class SpeakingRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='speaking')
    score = models.IntegerField()
    audio = models.FileField()
    input_script = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

