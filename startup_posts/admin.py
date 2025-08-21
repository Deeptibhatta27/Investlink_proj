from django.contrib import admin
from .models import StartupPost, PostComment

@admin.register(StartupPost)
class StartupPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'content', 'created_at')
    search_fields = ('title', 'content')
    list_filter = ('created_at', 'author')
    raw_id_fields = ('author', 'likes')

@admin.register(PostComment)
class PostCommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'content', 'created_at')
    search_fields = ('content',)
    list_filter = ('created_at', 'author')
    raw_id_fields = ('author', 'post')
