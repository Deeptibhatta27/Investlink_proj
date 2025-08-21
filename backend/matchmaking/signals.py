from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import InvestorPreferences, StartupProfile, AIMatch
from accounts.models import User

@receiver(post_save, sender=InvestorPreferences)
def update_matches_for_investor(sender, instance, created, **kwargs):
    """Update matches when investor preferences are updated"""
    from .ai_matchmaker import AIMatchmaker
    
    ai_matcher = AIMatchmaker()
    startups = User.objects.filter(role='startup')
    
    for startup in startups:
        try:
            factors = startup.startup_factors
            result = ai_matcher.get_smart_suggestions(
                startup_factors=factors.__dict__,
                investor_preferences=instance.__dict__,
                historical_matches=[]
            )
            
            AIMatch.objects.update_or_create(
                investor=instance.investor,
                startup=startup,
                defaults={
                    'compatibility_score': result['compatibility_score'],
                    'ai_analysis': result.get('ai_analysis', ''),
                    'match_explanation': result.get('match_explanation', ''),
                    'suggestion_type': result['suggestion_type'],
                    'confidence_score': result['confidence_score'],
                    'factor_breakdown': result.get('factor_breakdown', {})
                }
            )
        except Exception as e:
            print(f"Error updating match for startup {startup.id}: {str(e)}")

@receiver(post_save, sender=StartupProfile)
def update_matches_for_startup(sender, instance, created, **kwargs):
    """Update matches when startup profile is updated"""
    from .ai_matchmaker import AIMatchmaker
    
    ai_matcher = AIMatchmaker()
    investors = User.objects.filter(role='investor')
    
    for investor in investors:
        try:
            preferences = investor.investor_prefs
            result = ai_matcher.get_smart_suggestions(
                startup_factors=instance.__dict__,
                investor_preferences=preferences.__dict__,
                historical_matches=[]
            )
            
            AIMatch.objects.update_or_create(
                investor=investor,
                startup=instance.startup,
                defaults={
                    'compatibility_score': result['compatibility_score'],
                    'ai_analysis': result.get('ai_analysis', ''),
                    'match_explanation': result.get('match_explanation', ''),
                    'suggestion_type': result['suggestion_type'],
                    'confidence_score': result['confidence_score'],
                    'factor_breakdown': result.get('factor_breakdown', {})
                }
            )
        except Exception as e:
            print(f"Error updating match for investor {investor.id}: {str(e)}")
