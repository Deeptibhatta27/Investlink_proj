from django.core.management.base import BaseCommand
from faker import Faker
import random
from accounts.models import User
from matchmaking.models import StartupProfile, InvestorPreferences

class Command(BaseCommand):
    help = "Generate dummy startup and investor data"

    def handle(self, *args, **kwargs):
        fake = Faker()

        industries = ["FinTech", "EdTech", "HealthTech", "AI/ML", "E-commerce", "CleanTech", "Blockchain"]
        stages = ["Seed", "Series A", "Series B", "Series C"]
        markets = ["Global", "North America", "Europe", "Asia", "Africa"]

        # Create startup profiles
        startup_users = User.objects.filter(role='startup')
        for startup in startup_users:
            if not hasattr(startup, 'startup_profile'):
                StartupProfile.objects.create(
                    startup=startup,
                    industry=random.choice(industries),
                    funding_stage=random.choice(stages),
                    target_market=random.choice(markets),
                    revenue=random.randint(10000, 1000000),
                    growth_rate=random.uniform(0.1, 0.5),
                    team_size=random.randint(5, 50),
                    technological_innovation=random.randint(1, 10),
                    market_size=random.randint(1000000, 100000000),
                    competition_level=random.randint(1, 10)
                )

        # Create investor preferences
        investor_users = User.objects.filter(role='investor')
        for investor in investor_users:
            if not hasattr(investor, 'investor_preferences'):
                InvestorPreferences.objects.create(
                    investor=investor,
                    preferred_industries=random.sample(industries, random.randint(1, 3)),
                    investment_stage=random.sample(stages, random.randint(1, 2)),
                    min_investment=random.randint(50000, 200000),
                    max_investment=random.randint(500000, 2000000),
                    target_markets=random.sample(markets, random.randint(1, 3)),
                    risk_appetite=random.randint(1, 10),
                    expected_return=random.uniform(0.1, 0.4),
                    investment_timeline=random.choice([12, 24, 36, 48, 60])
                )

        self.stdout.write(self.style.SUCCESS("✅ Test profiles created successfully"))
