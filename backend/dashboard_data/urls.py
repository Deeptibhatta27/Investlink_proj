from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'investments', views.InvestmentViewSet, basename='investment')
router.register(r'startup-metrics', views.StartupMetricsViewSet, basename='startup-metrics')
router.register(r'market-updates', views.MarketUpdateViewSet, basename='market-update')
router.register(r'deal-flow', views.DealFlowViewSet, basename='deal-flow')
router.register(r'milestones', views.MilestoneViewSet, basename='milestone')

urlpatterns = [
    path('', include(router.urls)),
]
