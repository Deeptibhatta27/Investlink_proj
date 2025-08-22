import os
import django

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investlink.settings')
django.setup()

# Import models
from accounts.models import User
from matchmaking.models import InvestorPreferences, StartupProfile
from matchmaking.ai_matchmaker import AIMatchmaker

def main():
    print("Starting test...")
    
    # Create test data
    print("\nCreating test users...")
    try:
        investor = User.objects.create(
            email='investor2@test.com',
            username='testinvestor2',
            role='investor',
            is_active=True
        )
        investor.set_password('test123')
        investor.save()
        
        startup = User.objects.create(
            email='startup2@test.com',
            username='teststartup2',
            role='startup',
            is_active=True
        )
        startup.set_password('test123')
        startup.save()
        
        print("Users created successfully")
        
        # Create profiles
        print("\nCreating profiles...")
        pref = InvestorPreferences.objects.create(
            investor=investor,
            preferred_industries=['Technology', 'Healthcare'],
            investment_stage=['Seed', 'Series A'],
            min_investment=50000,
            max_investment=1000000,
            target_markets=['Global', 'North America'],
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
        
        print("Profiles created successfully")
        
        # Test matching
        print("\nTesting AI matching...")
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
        
        # Get basic score
        score, factors = matchmaker.calculate_compatibility_score(startup_data, investor_data)
        print(f'\nBasic Match Score: {score:.1f}%')
        print('Factor Breakdown:')
        for factor, value in factors.items():
            print(f'- {factor}: {value:.2f}')
        
        # Try AI analysis
        try:
            ai_result = matchmaker.get_smart_suggestions(startup_data, investor_data, [])
            print(f'\nAI Analysis:')
            print(f'Compatibility Score: {ai_result.get("compatibility_score", "N/A")}')
            print(f'Recommendation: {ai_result.get("recommendation_strength", "N/A")}')
            print(f'Analysis: {ai_result.get("ai_analysis", "N/A")}')
        except Exception as e:
            print(f'\nAI Analysis Error: {str(e)}')
            print('Falling back to basic scoring...')
            
    except Exception as e:
        print(f"Error during test: {str(e)}")

if __name__ == '__main__':
    main()
