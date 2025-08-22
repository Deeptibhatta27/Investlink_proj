from django.contrib import admin
from .models import StartupPost

@admin.register(StartupPost)
class StartupPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'created_at', 'views')
    search_fields = ('title', 'content', 'author__username')
    date_hierarchy = 'created_at'
    raw_id_fields = ('author', 'likes')
    list_filter = ('created_at', 'updated_at')
