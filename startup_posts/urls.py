from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StartupPostViewSet

router = DefaultRouter()
router.register(r'startup-posts', StartupPostViewSet, basename='startup-posts')

urlpatterns = [
    path('', include(router.urls)),
]
