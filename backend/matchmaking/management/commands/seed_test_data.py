from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import User
from matchmaking.models import StartupProfile, InvestorPreferences
from faker import Faker
import random

fake = Faker()

INDUSTRIES = [
    'Technology', 'Healthcare', 'Fintech', 'E-commerce', 'AI/ML',
    'Clean Energy', 'Biotech', 'EdTech', 'AgriTech', 'Cybersecurity'
]

FUNDING_STAGES = [
    'Seed', 'Series A', 'Series B', 'Series C', 'Growth'
]

MARKETS = [
    'North America', 'Europe', 'Asia', 'Global', 'Emerging Markets',
    'LATAM', 'APAC', 'Africa', 'Middle East'
]

class Command(BaseCommand):
    help = 'Seeds the database with test startups and investors'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating test data...')
        
        # Create test startups
        for i in range(5):
            # List of real-sounding startup names
            startup_names = [
                'TechVision AI',
                'GreenEnergy Solutions',
                'HealthTech Innovations',
                'FinanceFlow',
                'CloudScale Systems'
            ]
            
            # Create startup user
            startup_user = User.objects.create(
                username=startup_names[i].lower().replace(' ', '_'),
                email=f'{startup_names[i].lower().replace(" ", "")}@example.com',
                role='startup',
                founder_name=fake.name(),
                startup_name=startup_names[i],
                company_description=fake.text(max_nb_chars=200)
            )
            startup_user.set_password('testpass123')
            startup_user.save()

            # Create startup profile
            StartupProfile.objects.create(
                startup=startup_user,
                industry=random.choice(INDUSTRIES),
                funding_stage=random.choice(FUNDING_STAGES),
                target_market=random.choice(MARKETS),
                revenue=random.randint(100000, 10000000),
                growth_rate=random.randint(10, 100),
                team_size=random.randint(5, 100),
                technological_innovation=random.randint(5, 10),
                market_size=random.randint(1000000, 1000000000),
                competition_level=random.randint(3, 10)
            )

        # Create test investors
        for i in range(5):
            # Create investor user
            investor_user = User.objects.create(
                username=f'investor_{i}',
                email=f'investor{i}@example.com',
                role='investor',
                founder_name=fake.name(),
                investment_firm=f'{fake.company()} Ventures',
                company_description=fake.text(max_nb_chars=200)
            )
            investor_user.set_password('testpass123')
            investor_user.save()

            # Create investor preferences
            InvestorPreferences.objects.create(
                investor=investor_user,
                preferred_industries=random.sample(INDUSTRIES, 3),
                investment_stage=random.sample(FUNDING_STAGES, 2),
                min_investment=random.randint(100000, 1000000),
                max_investment=random.randint(1000000, 10000000),
                target_markets=random.sample(MARKETS, 3),
                risk_appetite=random.randint(5, 10),
                expected_return=random.randint(20, 50),
                investment_timeline=random.randint(12, 60)
            )

        self.stdout.write(self.style.SUCCESS('Successfully created test data'))
