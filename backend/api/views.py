from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from django.http import JsonResponse
from .models import User, Photo, Word, Experience
from .serializers import (
    UserSerializer, UserCreateSerializer,
    PhotoSerializer, PhotoCreateSerializer,
    WordSerializer, WordCreateSerializer,
    ExperienceSerializer, ExperienceCreateSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'])
    def by_username(self, request):
        username = request.query_params.get('username', None)
        if username is not None:
            user = User.objects.filter(username=username).first()
            if user:
                serializer = self.get_serializer(user)
                return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PhotoCreateSerializer
        return PhotoSerializer
    
    @action(detail=False, methods=['get'])
    def top(self, request):
        limit = int(request.query_params.get('limit', 5))
        photos = Photo.objects.order_by('-likes')[:limit]
        serializer = self.get_serializer(photos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        photo = self.get_object()
        photo.likes += 1
        photo.save()
        serializer = self.get_serializer(photo)
        return Response(serializer.data)

class WordViewSet(viewsets.ModelViewSet):
    queryset = Word.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return WordCreateSerializer
        return WordSerializer
    
    @action(detail=False, methods=['get'])
    def top(self, request):
        limit = int(request.query_params.get('limit', 5))
        words = Word.objects.order_by('-likes')[:limit]
        serializer = self.get_serializer(words, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        word = self.get_object()
        word.likes += 1
        word.save()
        serializer = self.get_serializer(word)
        return Response(serializer.data)

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ExperienceCreateSerializer
        return ExperienceSerializer

# Authentication views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        data = request.data
        # パスワードのハッシュ化
        data['password'] = make_password(data['password'])
        
        user = User.objects.create(
            username=data['username'],
            password=data['password'],
            is_japanese=data.get('is_japanese', False)
        )
        
        # ログインさせる
        login(request, user)
        
        # パスワードを除外したユーザーデータを返す
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response({"message": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({"message": "Please provide both username and password"}, status=status.HTTP_400_BAD_REQUEST)
    
    # ユーザー認証
    user = authenticate(username=username, password=password)
    
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    else:
        return Response({"message": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_current_user(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    else:
        return Response({"message": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)