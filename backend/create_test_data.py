import os
import sys
import django
import json
from decimal import Decimal

# Configure Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investlink.settings')
try:
    django.setup()
except Exception as e:
    print(f"Failed to setup Django: {e}")
    sys.exit(1)

# Import models
try:
    from accounts.models import User
    from matchmaking.models import InvestorPreferences, StartupProfile, AIMatch
    from django.db import transaction
    print("Models imported successfully")
except Exception as e:
    print(f"Failed to import models: {e}")
    sys.exit(1)

# Helper functions
def create_test_data():
    """Create test users and profiles"""
    try:
        with transaction.atomic():
            # Create investor
            investor = User.objects.create(
                email='test.investor@example.com',
                username='test_investor',
                role='investor',
                is_active=True
            )
            investor.set_password('test123')
            investor.save()
            print(f"Created investor: {investor.email}")
            
            # Create investor preferences
            pref = InvestorPreferences.objects.create(
                investor=investor,
                preferred_industries=['Technology', 'Healthcare'],
                investment_stage=['Seed', 'Series A'],
                min_investment=Decimal('50000'),
                max_investment=Decimal('1000000'),
                target_markets=['Global', 'North America'],
                risk_appetite=7,
                expected_return=25.0,
                investment_timeline=36
            )
            print(f"Created investor preferences for {investor.email}")
            
            # Create startup
            startup = User.objects.create(
                email='test.startup@example.com',
                username='test_startup',
                role='startup',
                is_active=True
            )
            startup.set_password('test123')
            startup.save()
            print(f"Created startup: {startup.email}")
            
            # Create startup profile
            profile = StartupProfile.objects.create(
                startup=startup,
                industry='Technology',
                funding_stage='Seed',
                target_market='Global',
                revenue=Decimal('100000'),
                growth_rate=15.5,
                team_size=10,
                technological_innovation=8,
                market_size=Decimal('1000000000'),
                competition_level=7
            )
            print(f"Created startup profile for {startup.email}")
            
            # Create AI match
            match = AIMatch.objects.create(
                investor=investor,
                startup=startup,
                compatibility_score=85.5,
                suggestion_type='direct',
                confidence_score=90.0,
                factor_breakdown={
                    'industry_match': 0.9,
                    'stage_match': 0.8,
                    'market_match': 0.85,
                    'risk_score': 0.75,
                    'growth_potential': 0.9,
                    'market_size_score': 0.95
                },
                ai_analysis="""
                Strong match potential based on industry alignment, growth trajectory, and market opportunity.
                The startup's technology focus and seed stage aligns well with investor preferences.
                """,
                match_explanation="""
                Key synergies:
                - Perfect industry match (Technology)
                - Matching funding stage (Seed)
                - Strong market alignment (Global)
                - Growth potential aligns with expected returns
                - Risk profile shows good compatibility
                """
            )
            print(f"Created AI match between {investor.email} and {startup.email}")
            
            print("\nAll test data created successfully!")
            
    except Exception as e:
        print(f"Error creating test data: {e}")
        raise

if __name__ == '__main__':
    print("\nStarting test data creation...")
    try:
        # Clean up existing data
        User.objects.filter(email__startswith='test.').delete()
        print("Cleaned up existing test data")
        
        # Create new test data
        create_test_data()
        
        # Verify data
        print("\nVerifying data...")
        print(f"Users: {User.objects.count()}")
        print(f"Investor Preferences: {InvestorPreferences.objects.count()}")
        print(f"Startup Profiles: {StartupProfile.objects.count()}")
        print(f"AI Matches: {AIMatch.objects.count()}")
        
    except Exception as e:
        print(f"\nFatal error: {e}")
        sys.exit(1)
