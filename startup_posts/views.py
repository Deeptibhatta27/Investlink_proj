from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import StartupPost, PostComment
from .serializers import StartupPostSerializer, PostCommentSerializer
from accounts.permissions import IsStartupOrReadOnly

class StartupPostViewSet(viewsets.ModelViewSet):
    serializer_class = StartupPostSerializer
    permission_classes = [permissions.IsAuthenticated, IsStartupOrReadOnly]

    def get_queryset(self):
        return StartupPost.objects.all().select_related('startup')

    def perform_create(self, serializer):
        serializer.save(startup=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user

        if user in post.likes.all():
            post.likes.remove(user)
            return Response({'status': 'unliked'})
        else:
            post.likes.add(user)
            return Response({'status': 'liked'})

    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        post = self.get_object()
        serializer = PostCommentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(post=post, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
