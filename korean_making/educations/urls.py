from django.urls import path
from .views import AudioUploadView
from . import views


app_name = 'educations'
urlpatterns = [
    path('speaking/', views.speaking, name="speaking"),
    path('api/upload-audio/', AudioUploadView.as_view(), name='audio-upload'),
    path('writing/', views.writing, name="writing"),
]