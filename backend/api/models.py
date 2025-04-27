from django.db import models
from django.utils import timezone

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    is_japanese = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.username

class Photo(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image_url = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='photos')
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

class Word(models.Model):
    original = models.CharField(max_length=140)
    translation = models.CharField(max_length=140, blank=True, null=True)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='words')
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.original

class Experience(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image_url = models.CharField(max_length=255)
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title
