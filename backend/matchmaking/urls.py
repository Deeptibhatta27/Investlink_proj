from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchmakingViewSet

router = DefaultRouter()
router.register(r'matches', MatchmakingViewSet, basename='match')

urlpatterns = [
    path('', include(router.urls)),
]
