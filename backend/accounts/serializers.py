from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'name',
            'email',
            'role',
            'company',
            'description',
            'linkedin_url',
            'industry',
            'location',
            'founder_name',
            'company_description',
            'investment_range',
            'preferred_sectors',
            'funding_stage'
        ]
        extra_kwargs = {
            'email': {'write_only': True}  # Don't expose email in GET requests
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # Add connection status if there's a request context
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            data['is_connected'] = request.user.connections.filter(id=instance.id).exists()
        
        # Convert to the format expected by the frontend
        return {
            'id': data['id'],
            'name': data['name'],
            'role': data['role'],
            'company': data['company'],
            'description': data.get('company_description') or data.get('description', ''),
            'imageUrl': '/profile-placeholder.jpg',  # TODO: Add actual profile image handling
            'type': data['role'],  # 'investor' or 'startup'
            'industry': data.get('industry', ''),
            'location': data.get('location', ''),
            'linkedinUrl': data.get('linkedin_url'),
            'email': instance.email if self.context.get('include_private', False) else None
        }
