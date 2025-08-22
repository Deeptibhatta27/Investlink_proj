from rest_framework import serializers
from .models import StartupPost, PostComment

class PostCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = PostComment
        fields = ['id', 'content', 'created_at', 'user_name']
        read_only_fields = ['user']

class StartupPostSerializer(serializers.ModelSerializer):
    startup_name = serializers.CharField(source='startup.company', read_only=True)
    startup_logo = serializers.CharField(source='startup.company_logo', read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    comments = PostCommentSerializer(many=True, read_only=True)
    has_liked = serializers.SerializerMethodField()

    class Meta:
        model = StartupPost
        fields = [
            'id', 'content', 'video', 'created_at', 'startup_name',
            'startup_logo', 'likes_count', 'comments_count', 'comments',
            'has_liked'
        ]
        read_only_fields = ['startup']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_has_liked(self, obj):
        user = self.context['request'].user
        return user in obj.likes.all() if user.is_authenticated else False
