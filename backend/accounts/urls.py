from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    protected_view,
    AdminOnlyView,
    InvestorRegisterView,
    StartupRegisterView,
    InvestorDashboardView,
    StartupDashboardView,
    home,
    CustomTokenObtainPairView,
    NetworkListView,
    NetworkConnectionView,
)

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', protected_view, name='protected'),
    path('admin-only/', AdminOnlyView.as_view(), name='admin_only'),

    # Registration endpoints
    path('register/investor/', InvestorRegisterView.as_view(), name='register_investor'),
    path('register/startup/', StartupRegisterView.as_view(), name='register_startup'),

    # Dashboard endpoints
    path('investor-dashboard/', InvestorDashboardView.as_view(), name='investor_dashboard'),
    path('startup-dashboard/', StartupDashboardView.as_view(), name='startup_dashboard'),

    # Network endpoints
    path('network/', NetworkListView.as_view(), name='network_list'),
    path('network/connect/<int:user_id>/', NetworkConnectionView.as_view(), name='network_connect'),

    # Public homepage
    path('', home, name='home'),
]
