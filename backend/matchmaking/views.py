from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import StartupProfile, InvestorPreferences, AIMatch
from .ai_matchmaker import AIMatchmaker
from .serializers import (
    StartupProfileSerializer,
    InvestorPreferencesSerializer,
    AIMatchSerializer
)

class MatchmakingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['update_profile', 'get_profile']:
            return StartupProfileSerializer
        elif self.action in ['update_preferences', 'get_preferences']:
            return InvestorPreferencesSerializer
        return AIMatchSerializer

    @action(detail=False, methods=['POST'])
    def update_profile(self, request):
        """Update startup profile"""
        if request.user.role != 'startup':
            return Response(
                {"error": "Only startups can update their profile"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        try:
            # Convert numeric fields to proper types
            data = request.data.copy()
            numeric_fields = ['revenue', 'growth_rate', 'team_size', 'technological_innovation', 'market_size', 'competition_level']
            for field in numeric_fields:
                if field in data:
                    try:
                        data[field] = float(data[field])
                    except (TypeError, ValueError):
                        data[field] = 0

            try:
                profile = StartupProfile.objects.get(startup=request.user)
                serializer = StartupProfileSerializer(profile, data=data)
            except StartupProfile.DoesNotExist:
                serializer = StartupProfileSerializer(data=data)
                
            if serializer.is_valid():
                serializer.save(startup=request.user)
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['POST'])
    def update_preferences(self, request):
        """Update investor preferences"""
        if request.user.role != 'investor':
            return Response(
                {"error": "Only investors can update preferences"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Convert numeric fields to proper types
            data = request.data.copy()
            numeric_fields = ['min_investment', 'max_investment', 'risk_appetite', 'expected_return', 'investment_timeline']
            for field in numeric_fields:
                if field in data:
                    try:
                        data[field] = float(data[field])
                    except (TypeError, ValueError):
                        data[field] = 0
            
            # Try to get existing preferences
            try:
                preferences = InvestorPreferences.objects.get(investor=request.user)
                serializer = InvestorPreferencesSerializer(preferences, data=data)
            except InvestorPreferences.DoesNotExist:
                serializer = InvestorPreferencesSerializer(data=data)

            # Validate and save
            if serializer.is_valid():
                serializer.save(investor=request.user)
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['GET'])
    def get_matches(self, request):
        """Get matches for the current user"""
        ai_matchmaker = AIMatchmaker()
        
        if request.user.role == 'investor':
            try:
                # Get the latest investor preferences
                preferences = InvestorPreferences.objects.filter(investor=request.user).order_by('-id').first()
                if not preferences:
                    return Response(
                        {"error": "Please update your investment preferences first"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                startup_profiles = StartupProfile.objects.all()
                matches = []
                for profile in startup_profiles:
                    # Prepare data for matching
                    startup_data = {
                        'industry': profile.industry,
                        'funding_stage': profile.funding_stage,
                        'target_market': profile.target_market,
                        'revenue': float(profile.revenue),
                        'growth_rate': float(profile.growth_rate),
                        'team_size': profile.team_size,
                        'technological_innovation': profile.technological_innovation,
                        'market_size': float(profile.market_size),
                        'competition_level': profile.competition_level
                    }
                    
                    investor_data = {
                        'preferred_industries': preferences.preferred_industries,
                        'investment_stage': preferences.investment_stage,
                        'min_investment': float(preferences.min_investment),
                        'max_investment': float(preferences.max_investment),
                        'target_markets': preferences.target_markets,
                        'risk_appetite': preferences.risk_appetite,
                        'expected_return': float(preferences.expected_return),
                        'investment_timeline': preferences.investment_timeline
                    }
                    
                    # Get existing matches for historical context
                    historical_matches = AIMatch.objects.filter(
                        Q(investor=request.user) | Q(startup=profile.startup)
                    ).values()
                    
                    # Get smart suggestions from AI
                    score_data = ai_matchmaker.get_smart_suggestions(
                        startup_data,
                        investor_data,
                        historical_matches
                    )
                    
                    # Save or update AI match
                    match, _ = AIMatch.objects.update_or_create(
                        investor=request.user,
                        startup=profile.startup,
                        defaults={
                            'compatibility_score': score_data['compatibility_score'],
                            'factor_breakdown': score_data['factor_breakdown'],
                            'suggestion_type': score_data['suggestion_type'],
                            'confidence_score': score_data['confidence_score'],
                            'ai_analysis': score_data['ai_analysis'],
                            'match_explanation': score_data['match_explanation']
                        }
                    )
                    
                    matches.append({
                        'startup': profile.startup.username,
                        'startup_id': profile.startup.id,
                        **score_data
                    })
                
                # Sort matches by compatibility score
                matches.sort(key=lambda x: x['compatibility_score'], reverse=True)
                return Response(matches)
                
            except InvestorPreferences.DoesNotExist:
                return Response(
                    {"error": "Please update your investment preferences first"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        else:  # Startup user
            try:
                profile = StartupProfile.objects.get(startup=request.user)
                investor_preferences = InvestorPreferences.objects.all()
                
                matches = []
                for preferences in investor_preferences:
                    # Prepare data for matching
                    startup_data = {
                        'industry': profile.industry,
                        'funding_stage': profile.funding_stage,
                        'target_market': profile.target_market,
                        'revenue': float(profile.revenue),
                        'growth_rate': float(profile.growth_rate),
                        'team_size': profile.team_size,
                        'technological_innovation': profile.technological_innovation,
                        'market_size': float(profile.market_size),
                        'competition_level': profile.competition_level
                    }
                    
                    investor_data = {
                        'preferred_industries': preferences.preferred_industries,
                        'investment_stage': preferences.investment_stage,
                        'min_investment': float(preferences.min_investment),
                        'max_investment': float(preferences.max_investment),
                        'target_markets': preferences.target_markets,
                        'risk_appetite': preferences.risk_appetite,
                        'expected_return': float(preferences.expected_return),
                        'investment_timeline': preferences.investment_timeline
                    }
                    
                    # Get existing matches for historical context
                    historical_matches = AIMatch.objects.filter(
                        Q(investor=preferences.investor) | Q(startup=request.user)
                    ).values()
                    
                    # Get smart suggestions from AI
                    score_data = ai_matchmaker.get_smart_suggestions(
                        startup_data,
                        investor_data,
                        historical_matches
                    )
                    
                    # Save or update AI match
                    match, _ = AIMatch.objects.update_or_create(
                        investor=preferences.investor,
                        startup=request.user,
                        defaults={
                            'compatibility_score': score_data['compatibility_score'],
                            'factor_breakdown': score_data['factor_breakdown'],
                            'suggestion_type': score_data['suggestion_type'],
                            'confidence_score': score_data['confidence_score'],
                            'ai_analysis': score_data['ai_analysis'],
                            'match_explanation': score_data['match_explanation']
                        }
                    )
                    
                    matches.append({
                        'investor': preferences.investor.username,
                        'investor_id': preferences.investor.id,
                        **score_data
                    })
                
                # Sort matches by compatibility score
                matches.sort(key=lambda x: x['compatibility_score'], reverse=True)
                return Response(matches)
                
            except StartupProfile.DoesNotExist:
                return Response(
                    {"error": "Please update your startup profile first"},
                    status=status.HTTP_400_BAD_REQUEST
                )

    @action(detail=True, methods=['GET'])
    def match_details(self, request, pk=None):
        """Get detailed match information"""
        try:
            if request.user.role == 'investor':
                match = AIMatch.objects.get(
                    investor=request.user,
                    startup_id=pk
                )
            else:
                match = AIMatch.objects.get(
                    startup=request.user,
                    investor_id=pk
                )
                
            serializer = AIMatchSerializer(match)
            return Response(serializer.data)
            
        except AIMatch.DoesNotExist:
            return Response(
                {"error": "Match not found"},
                status=status.HTTP_404_NOT_FOUND
            )
