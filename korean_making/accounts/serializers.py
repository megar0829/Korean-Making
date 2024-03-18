# api/serializers.py
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile
from educations.serializers import WritingRecordSerializer, SpeakingRecordSerializer

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        username = validated_data.get('username')
        email = validated_data.get('email')
        password = validated_data.get('password')
        user = User(
            username=username,
            email=email
        )
        user.set_password(password)
        user.save()
        return user
    
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        

# 프로필 시리얼라이저
class ProfileSerializer(serializers.ModelSerializer):
    writing = WritingRecordSerializer(many=True, read_only=True, source='user.writing.all')
    speaking = SpeakingRecordSerializer(many=True, read_only=True, source='user.speaking.all')
    class Meta:
        model = Profile
        fields = ('user_pk', 'nickname', 'country', 'exp', 'writing', 'speaking')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['writing'] = WritingRecordSerializer(instance.user.writing.all().order_by('-created_at'), many=True).data
        representation['speaking'] = SpeakingRecordSerializer(instance.user.speaking.all().order_by('-created_at'), many=True).data
        return representation











# # 회원가입
# class CreateUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ("id", "username", "password")
#         extra_kwargs = {"password": {"write_only": True}}

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             validated_data["username"], None, validated_data["password"]
#         )
#         return user


# # 접속 유지중인지 확인
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ("id", "username")


# # 로그인
# class LoginUserSerializer(serializers.Serializer):
#     username = serializers.CharField()
#     password = serializers.CharField()

#     def validate(self, data):
#         user = authenticate(**data)
#         if user and user.is_active:
#             return user
#         raise serializers.ValidationError("Unable to log in with provided credentials.")

# # api/serializers.py
# # 프로필 시리얼라이저
# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields = ("user_pk", "nickname", "email", "country", "exp")


# from django.contrib.auth.models import User
# from django.contrib.auth.password_validation import validate_password
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework import serializers
# from rest_framework.validators import UniqueValidator
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)
#         # Frontend에서 더 필요한 정보가 있다면 여기에 추가적으로 작성하면 됩니다. token["is_superuser"] = user.is_superuser 이런식으로요.
#         token['username'] = user.username
#         token['email'] = user.email
#         return token

# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(
#         write_only=True, required=True, validators=[validate_password])
#     password2 = serializers.CharField(write_only=True, required=True)

#     class Meta:
#         model = User
#         fields = ('username', 'password', 'password2')

#     def validate(self, attrs):
#         if attrs['password'] != attrs['password2']:
#             raise serializers.ValidationError(
#                 {"password": "Password fields didn't match."})

#         return attrs

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             password=validated_data['password']
#         )

#         return user  # Ensure that the user instance is returned




