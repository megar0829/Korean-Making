# urls.py
from django.urls import path, include
from .views import RegisterAPIView, AuthView, ProfileUpdateAPI, ProfileAPIView
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView, TokenBlacklistView

app_name = 'accounts'

urlpatterns = [
    path("register/", RegisterAPIView.as_view()), #회원가입하기
    path('login/', AuthView.as_view()), # 로그인하기 
    path('logout/', TokenBlacklistView.as_view()), # 로그아웃 - 로그아웃한 사용자의 토큰을 서버에서 차단
    path('refresh/', TokenRefreshView.as_view()), # 토큰 재발급하기 - body에 {'refresh' : 리프레시토큰 } 보내준다
    path("profile/<int:user_pk>/update/", ProfileUpdateAPI.as_view()), # 프로필 수정
    path("profile/<username>/", ProfileAPIView.as_view()),
]
