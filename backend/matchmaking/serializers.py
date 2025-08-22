from rest_framework import serializers
from .models import StartupProfile, InvestorPreferences, AIMatch

class StartupProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartupProfile
        fields = [
            'startup',
            'industry',
            'funding_stage',
            'target_market',
            'revenue',
            'growth_rate',
            'team_size',
            'technological_innovation',
            'market_size',
            'competition_level'
        ]

class InvestorPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestorPreferences
        fields = [
            'investor',
            'preferred_industries',
            'investment_stage',
            'min_investment',
            'max_investment',
            'target_markets',
            'risk_appetite',
            'expected_return',
            'investment_timeline'
        ]

class AIMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIMatch
        fields = [
            'investor',
            'startup',
            'compatibility_score',
            'ai_analysis',
            'match_explanation',
            'suggestion_type',
            'confidence_score',
            'factor_breakdown',
            'created_at',
            'updated_at'
        ]
