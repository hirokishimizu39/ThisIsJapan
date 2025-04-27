from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, PhotoViewSet, WordViewSet, ExperienceViewSet,
    register_user, login_user, logout_user, get_current_user
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'photos', PhotoViewSet)
router.register(r'words', WordViewSet)
router.register(r'experiences', ExperienceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Authentication endpoints
    path('register', register_user, name='register'),
    path('login', login_user, name='login'),
    path('logout', logout_user, name='logout'),
    path('user', get_current_user, name='current-user'),
]