from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PhotoViewSet, WordViewSet, ExperienceViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'photos', PhotoViewSet)
router.register(r'words', WordViewSet)
router.register(r'experiences', ExperienceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]