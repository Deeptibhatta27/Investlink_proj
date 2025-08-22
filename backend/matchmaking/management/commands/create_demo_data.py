from django.core.management.base import BaseCommand
from accounts.models import User
from startup_posts.models import StartupProfile
from matchmaking.models import InvestorPreferences

class Command(BaseCommand):
    help = 'Create demo investor and startup profiles for matchmaking demo.'

    def handle(self, *args, **kwargs):
        # Create demo investor
        investor, _ = User.objects.get_or_create(
            email='investor@example.com',
            defaults={
                'username': 'investor',
                'role': 'investor',
                'is_active': True
            }
        )
        InvestorPreferences.objects.get_or_create(
            investor=investor,
            defaults={
                'preferred_industries': ['Technology', 'Healthcare'],
                'investment_stage': ['Seed', 'Series A'],
                'min_investment': 50000,
                'max_investment': 1000000,
                'target_markets': ['Global', 'North America'],
                'risk_appetite': 7,
                'expected_return': 25.0,
                'investment_timeline': 36
            }
        )

        # Create demo startup
        startup, _ = User.objects.get_or_create(
            email='startup@example.com',
            defaults={
                'username': 'startup',
                'role': 'startup',
                'is_active': True
            }
        )
        StartupProfile.objects.get_or_create(
            startup=startup,
            defaults={
                'industry': 'Technology',
                'funding_stage': 'Seed',
                'target_market': 'Global',
                'revenue': 100000,
                'growth_rate': 15.5,
                'team_size': 10,
                'technological_innovation': 8,
                'market_size': 1000000000,
                'competition_level': 7
            }
        )

        self.stdout.write(self.style.SUCCESS('Demo investor and startup created!'))
