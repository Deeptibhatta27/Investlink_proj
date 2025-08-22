from django.contrib import admin
from django.urls import path, include
from . import views  # Make sure views.home is defined here

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/messages/', include('chat_messages.urls')),
    path('api/matchmaking/', include('matchmaking.urls')),
    path('api/dashboard/', include('dashboard_data.urls')),
    path('api/startup-posts/', include('startup_posts.urls')),
    path('', views.home, name='home'),  # Homepage URL
]
