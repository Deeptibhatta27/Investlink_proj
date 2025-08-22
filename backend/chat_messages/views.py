from django.db.models import Q
from rest_framework import viewsets, permissions
from .models import Message
from .serializers import MessageSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(recipient=user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=False, methods=['get'])
    def with_user(self, request):
        other_user_id = request.query_params.get('user_id')
        if not other_user_id:
            return Response({'error': 'user_id parameter is required'}, status=400)
            
        messages = Message.objects.filter(
            (Q(sender=request.user) & Q(recipient=other_user_id)) |
            (Q(sender=other_user_id) & Q(recipient=request.user))
        ).order_by('-timestamp')
        
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)
