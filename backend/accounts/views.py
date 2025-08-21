from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.http import HttpResponse
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.db.models import Q
from rest_framework import serializers

from .models import User
from .permissions import IsAdmin, IsInvestor, IsStartup
from .serializers import UserSerializer  # We'll create this nextamework.views import APIView 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.http import HttpResponse
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User
from .permissions import IsAdmin, IsInvestor, IsStartup  # You’ll need to define IsInvestor & IsStartup in permissions.py

# Function-based JWT-protected view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "You are authenticated!"})

# Class-based JWT-protected view
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Hello, {request.user.username}! You are authenticated."})

# Public homepage
def home(request):
    return HttpResponse("Welcome to InvestLink!")

class NetworkListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get query parameters
            user_type = request.query_params.get('type', 'all')
            industry = request.query_params.get('industry')
            location = request.query_params.get('location')
            search = request.query_params.get('search')

            # Start with all users except the current user
            users = User.objects.exclude(id=request.user.id)

            # Apply filters
            if user_type != 'all':
                users = users.filter(role=user_type)
            if industry:
                users = users.filter(industry=industry)
            if location:
                users = users.filter(location__icontains=location)
            if search:
                users = users.filter(
                    Q(name__icontains=search) |
                    Q(company__icontains=search)
                )

            serializer = UserSerializer(
                users, 
                many=True,
                context={
                    'include_private': False,  # Don't include private data in list view
                    'request': request  # Pass request for connection status
                }
            )
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class NetworkConnectionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            # Get the user to connect with
            target_user = User.objects.get(id=user_id)
            
            # Don't allow self-connections
            if target_user.id == request.user.id:
                return Response(
                    {'message': 'Cannot connect with yourself'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if already connected
            if request.user.connections.filter(id=target_user.id).exists():
                return Response(
                    {'message': 'Already connected with this user'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Add the connection
            request.user.connections.add(target_user)
            
            return Response({
                'message': 'Successfully connected',
                'user': UserSerializer(target_user, context={'include_private': False}).data
            })
        except User.DoesNotExist:
            return Response(
                {'message': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Admin-only view
class AdminOnlyView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({"message": "Hello Admin!"})

# ========== Registration Views ==========
class InvestorRegisterView(APIView):
    def post(self, request):
        data = request.data
        try:
            user = User.objects.create(
                username=data['username'],
                password=make_password(data['password']),
                role='investor',
                first_name=data.get('firstName', ''),
                last_name=data.get('lastName', ''),
                email=data.get('email', ''),
                investment_firm=data.get('investmentFirm', ''),
                investment_range=data.get('investmentRange', ''),
                preferred_sectors=data.get('preferredSectors', ''),
                phone=data.get('phone', '')
            )
            return Response({
                'message': 'Investor registered successfully',
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'message': f'Registration failed: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class StartupRegisterView(APIView):
    def post(self, request):
        data = request.data
        try:
            user = User.objects.create(
                username=data['username'],
                password=make_password(data['password']),
                role='startup',
                email=data.get('email', ''),
                founder_name=data.get('founderName', ''),
                startup_name=data.get('startupName', ''),
                industry_sector=data.get('industrySector', ''),
                funding_stage=data.get('fundingStage', ''),
                company_description=data.get('companyDescription', ''),
                phone=data.get('phone', '')
            )
            return Response({
                'message': 'Startup registered successfully',
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'message': f'Registration failed: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

# ========== Dashboard Views ==========
class InvestorDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsInvestor]

    def get(self, request):
        return Response({'dashboard': 'Welcome, Investor!'})

class StartupDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsStartup]

    def get(self, request):
        return Response({'dashboard': 'Welcome, Startup!'})

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['role'] = serializers.CharField(write_only=True, required=True)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Check if the user's role matches the one provided in the request
        if self.user.role != self.initial_data.get('role'):
            raise AuthenticationFailed(
                'Invalid credentials for the selected role.',
                'no_active_account'
            )
            
        data['role'] = self.user.role
        data['username'] = self.user.username
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
