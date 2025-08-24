from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'username',
            'email',
            'role',
            'investment_firm',
            'startup_name',
            'company_description',
            'industry_sector',
            'founder_name',
            'investment_range',
            'preferred_sectors',
            'funding_stage',
            'phone'
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
        
        # Determine company name based on role
        company_name = ''
        if instance.role == 'investor':
            company_name = instance.investment_firm or ''
        elif instance.role == 'startup':
            company_name = instance.startup_name or ''
        
        # Convert to the format expected by the frontend
        return {
            'id': data['id'],
            'name': instance.get_full_name() or instance.username,
            'role': data['role'],
            'company': company_name,
            'description': data.get('company_description', ''),
            'imageUrl': '/profile-placeholder.jpg',  # TODO: Add actual profile image handling
            'type': data['role'],  # 'investor' or 'startup'
            'industry': data.get('industry_sector', ''),
            'location': '',  # Not in model, but required by frontend
            'linkedinUrl': '',  # Not in model, but required by frontend
            'email': instance.email if self.context.get('include_private', False) else None,
            'investmentRange': data.get('investment_range', ''),
            'preferredSectors': data.get('preferred_sectors', ''),
            'fundingStage': data.get('funding_stage', ''),
            'is_connected': data.get('is_connected', False)
        }
