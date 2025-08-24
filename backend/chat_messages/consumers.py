import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from .models import Message
from accounts.models import User

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the user ID from the URL route
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        
        # Get token from query string
        query_string = self.scope['query_string'].decode()
        token = None
        if 'token=' in query_string:
            token = query_string.split('token=')[1].split('&')[0] if '&' in query_string else query_string.split('token=')[1]
        
        # Authenticate user with JWT token
        if token:
            try:
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                self.user = await self.get_user(user_id)
                if not self.user:
                    await self.close()
                    return
            except Exception as e:
                print(f"Token authentication failed: {e}")
                await self.close()
                return
        else:
            self.user = self.scope['user']
            
        # Check if user is authenticated
        if not self.user or isinstance(self.user, AnonymousUser):
            await self.close()
            return
            
        # Verify that the user ID in the URL matches the authenticated user
        if str(self.user.id) != self.user_id:
            await self.close()
            return
            
        # Create a unique group name for this user
        self.room_group_name = f'user_{self.user_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        recipient_id = text_data_json['recipient_id']
        
        # Get recipient user
        recipient = await self.get_user(recipient_id)
        if not recipient:
            return
            
        # Check if communication is allowed based on roles
        if not await self.can_communicate(recipient):
            await self.send(text_data=json.dumps({
                'error': 'You can only communicate with investors or startups'
            }))
            return
            
        # Save message to database
        saved_message = await self.save_message(message, recipient_id)
        
        # Send message to sender's group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': self.user.id,
                'sender_username': self.user.username,
                'recipient_id': recipient_id,
                'timestamp': saved_message.timestamp.isoformat(),
            }
        )
        
        # Send message to recipient's group
        await self.channel_layer.group_send(
            f'user_{recipient_id}',
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': self.user.id,
                'sender_username': self.user.username,
                'recipient_id': recipient_id,
                'timestamp': saved_message.timestamp.isoformat(),
            }
        )

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'recipient_id': event['recipient_id'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, message, recipient_id):
        recipient = User.objects.get(id=recipient_id)
        return Message.objects.create(
            sender=self.user,
            recipient=recipient,
            content=message
        )

    @database_sync_to_async
    def can_communicate(self, recipient):
        # Only allow communication between investors and startups
        # Admins can communicate with anyone
        if self.user.role == 'admin' or recipient.role == 'admin':
            return True
            
        # Investors can only communicate with startups
        if self.user.role == 'investor' and recipient.role == 'startup':
            return True
            
        # Startups can only communicate with investors
        if self.user.role == 'startup' and recipient.role == 'investor':
            return True
            
        return False