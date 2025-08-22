from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserListView,
    UserProfileView,
    LogoutView,
    CheckAuthView,
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-auth/', CheckAuthView.as_view(), name='check-auth'),
]
