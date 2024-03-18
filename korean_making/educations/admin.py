from django.contrib import admin
from .models import Sentence, SpeakingRecord, WritingRecord

admin.site.register(Sentence)
admin.site.register(SpeakingRecord)
admin.site.register(WritingRecord)