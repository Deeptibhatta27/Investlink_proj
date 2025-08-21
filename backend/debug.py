import os
import sys
import traceback
import django

def setup_django():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investlink.settings')
    print(f"PYTHONPATH: {os.environ.get('PYTHONPATH')}")
    print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    print(f"Current directory: {os.getcwd()}")
    print(f"Directory contents: {os.listdir()}")
    
    try:
        django.setup()
        print("Django setup successful")
    except Exception as e:
        print(f"Django setup error: {str(e)}")
        traceback.print_exc()
        return False
    return True

def check_models():
    try:
        from accounts.models import User
        from matchmaking.models import InvestorPreferences, StartupProfile
        print("\nChecking models:")
        print(f"User model: {User._meta.app_label}.{User.__name__}")
        print(f"InvestorPreferences model: {InvestorPreferences._meta.app_label}.{InvestorPreferences.__name__}")
        print(f"StartupProfile model: {StartupProfile._meta.app_label}.{StartupProfile.__name__}")
        return True
    except Exception as e:
        print(f"\nError checking models: {str(e)}")
        traceback.print_exc()
        return False

def create_test_data():
    try:
        from accounts.models import User
        from matchmaking.models import InvestorPreferences, StartupProfile
        from django.contrib.auth.hashers import make_password
        
        # Create test users
        investor = User.objects.create(
            email='investor@test.com',
            password=make_password('test123'),
            username='testinvestor',
            role='investor'
        )
        
        startup = User.objects.create(
            email='startup@test.com',
            password=make_password('test123'),
            username='teststartup',
            role='startup'
        )
        
        print("\nUsers created successfully")
        
        # Create profiles
        pref = InvestorPreferences.objects.create(
            investor=investor,
            preferred_industries=['Technology'],
            investment_stage=['Seed'],
            min_investment=50000,
            max_investment=1000000,
            target_markets=['Global'],
            risk_appetite=7,
            expected_return=25.0,
            investment_timeline=36
        )
        
        prof = StartupProfile.objects.create(
            startup=startup,
            industry='Technology',
            funding_stage='Seed',
            target_market='Global',
            revenue=100000,
            growth_rate=15.5,
            team_size=10,
            technological_innovation=8,
            market_size=1000000000,
            competition_level=7
        )
        
        print("Test data created successfully!")
        return True
        
    except Exception as e:
        print(f"\nError creating test data: {str(e)}")
        traceback.print_exc()
        return False

def test_matching():
    try:
        from matchmaking.models import InvestorPreferences, StartupProfile
        from matchmaking.ai_matchmaker import AIMatchmaker
        
        pref = InvestorPreferences.objects.first()
        prof = StartupProfile.objects.first()
        
        if not pref or not prof:
            print("\nNo test data found!")
            return False
            
        print("\nTesting matching...")
        matchmaker = AIMatchmaker()
        
        investor_data = {
            'preferred_industries': pref.preferred_industries,
            'investment_stage': pref.investment_stage,
            'min_investment': float(pref.min_investment),
            'max_investment': float(pref.max_investment),
            'target_markets': pref.target_markets,
            'risk_appetite': pref.risk_appetite,
            'expected_return': float(pref.expected_return),
            'investment_timeline': pref.investment_timeline
        }
        
        startup_data = {
            'industry': prof.industry,
            'funding_stage': prof.funding_stage,
            'target_market': prof.target_market,
            'revenue': float(prof.revenue),
            'growth_rate': float(prof.growth_rate),
            'team_size': prof.team_size,
            'technological_innovation': prof.technological_innovation,
            'market_size': float(prof.market_size),
            'competition_level': prof.competition_level
        }
        
        # Test basic matching
        score, factors = matchmaker.calculate_compatibility_score(startup_data, investor_data)
        print(f"\nBasic Match Score: {score:.1f}%")
        print("Factor Breakdown:")
        for factor, value in factors.items():
            print(f"- {factor}: {value:.2f}")
            
        # Test AI matching
        try:
            ai_result = matchmaker.get_smart_suggestions(startup_data, investor_data, [])
            print(f"\nAI Analysis Results:")
            print(f"Compatibility Score: {ai_result.get('compatibility_score', 'N/A')}")
            print(f"Recommendation: {ai_result.get('recommendation_strength', 'N/A')}")
            print(f"Analysis: {ai_result.get('ai_analysis', 'N/A')}")
            
        except Exception as e:
            print(f"\nAI Analysis Error: {str(e)}")
            print("Falling back to basic scoring...")
            
        return True
            
    except Exception as e:
        print(f"\nError testing matching: {str(e)}")
        traceback.print_exc()
        return False

def main():
    print("\n=== Starting Debug Session ===\n")
    
    if not setup_django():
        print("\nFailed to set up Django")
        return
        
    if not check_models():
        print("\nFailed to check models")
        return
        
    if not create_test_data():
        print("\nFailed to create test data")
        return
        
    if not test_matching():
        print("\nFailed to test matching")
        return
        
    print("\n=== Debug Session Complete ===\n")

if __name__ == '__main__':
    main()
