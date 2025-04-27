from rest_framework import serializers
from .models import User, Photo, Word, Experience

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'is_japanese', 'created_at']

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'is_japanese']
        extra_kwargs = {'password': {'write_only': True}}

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'title', 'description', 'image_url', 'user', 'likes', 'created_at']
        read_only_fields = ['likes']

class PhotoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['title', 'description', 'image_url', 'user']

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['id', 'original', 'translation', 'description', 'user', 'likes', 'created_at']
        read_only_fields = ['likes']

class WordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['original', 'translation', 'description', 'user']

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'title', 'description', 'image_url', 'location', 'created_at']

class ExperienceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['title', 'description', 'image_url', 'location']