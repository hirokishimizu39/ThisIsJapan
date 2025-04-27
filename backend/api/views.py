from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
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