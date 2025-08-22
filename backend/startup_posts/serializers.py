from rest_framework import serializers
from .models import StartupPost, PostComment
from accounts.serializers import UserSerializer

class PostCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = PostComment
        fields = ['id', 'content', 'created_at', 'author']
        read_only_fields = ['author']

class StartupPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = PostCommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = StartupPost
        fields = [
            'id',
            'title',
            'content',
            'video_url',
            'thumbnail_url',
            'created_at',
            'updated_at',
            'views',
            'author',
            'comments',
            'likes_count',
            'is_liked'
        ]
        read_only_fields = ['author', 'views', 'likes_count', 'is_liked']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
