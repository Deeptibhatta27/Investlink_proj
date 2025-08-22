from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from dashboard_data.models import Investment, StartupMetrics, MarketUpdate, DealFlow, Milestone
from faker import Faker
from datetime import date, timedelta
import random
from decimal import Decimal

fake = Faker()

class Command(BaseCommand):
    help = 'Creates realistic mock data for the dashboard'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        
        # Get users by role
        startup_users = User.objects.filter(role='startup')
        investor_users = User.objects.filter(role='investor')

        if not startup_users.exists() or not investor_users.exists():
            self.stdout.write(self.style.ERROR('No startup or investor users found. Please run seed_test_data first.'))
            return

        self.stdout.write('Creating mock dashboard data...')

        # Investment data
        company_sectors = ['AI/ML', 'Fintech', 'HealthTech', 'EdTech', 'CleanTech', 'E-commerce', 'SaaS', 'IoT']
        investment_stages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C']
        risk_levels = ['Low Risk', 'Medium Risk', 'High Risk']
        statuses = ['Active', 'Exited', 'Under Review']
        performance_statuses = ['Performing Well', 'Meeting Expectations', 'Needs Attention']

        # Create investments for each investor
        for investor in investor_users:
            num_investments = random.randint(3, 8)
            for _ in range(num_investments):
                initial_inv = Decimal(str(random.randint(50000, 2000000)))
                roi = Decimal(str(random.uniform(-0.3, 2.0)))
                Investment.objects.create(
                    investor=investor,
                    company_name=fake.company(),
                    company_sector=random.choice(company_sectors),
                    investment_stage=random.choice(investment_stages),
                    risk_level=random.choice(risk_levels),
                    status=random.choice(statuses),
                    invested_date=fake.date_between(start_date='-2y', end_date='today'),
                    initial_investment=initial_inv,
                    current_value=initial_inv * (1 + roi),
                    ownership_percentage=Decimal(str(random.uniform(1.0, 20.0))),
                    roi_percentage=roi * 100,
                    last_round=random.choice(['Seed', 'Series A', 'Series B']),
                    next_milestone='IPO Planning' if roi > 1.5 else 'Market Expansion' if roi > 0.5 else 'Product Development',
                    performance_status=random.choice(performance_statuses)
                )

        # Create startup metrics
        market_sizes = [1000000, 5000000, 10000000, 50000000, 100000000]
        for startup in startup_users:
            revenue = Decimal(str(random.randint(100000, 5000000)))
            burn_rate = Decimal(str(random.randint(20000, 200000)))
            runway = int(revenue / burn_rate * 12) if burn_rate > 0 else 24
            StartupMetrics.objects.create(
                startup=startup,
                revenue=revenue,
                burn_rate=burn_rate,
                runway_months=runway,
                team_size=random.randint(5, 100),
                customer_count=random.randint(100, 10000),
                churn_rate=Decimal(str(random.uniform(1.0, 8.0))),
                growth_rate=Decimal(str(random.uniform(5.0, 300.0))),
                market_size=Decimal(str(random.choice(market_sizes))),
                last_funding_date=fake.date_between(start_date='-1y', end_date='today'),
                last_funding_amount=Decimal(str(random.randint(500000, 10000000))),
                current_valuation=Decimal(str(random.randint(1000000, 50000000)))
            )

        # Create market updates
        impact_levels = ['High', 'Medium', 'Low']
        for sector in company_sectors:
            num_updates = random.randint(2, 5)
            for _ in range(num_updates):
                update = MarketUpdate.objects.create(
                    title=f"{sector} Market Update: {fake.catch_phrase()}",
                    content=fake.paragraph(nb_sentences=5),
                    sector=sector,
                    impact_level=random.choice(impact_levels),
                    source_url=fake.url()
                )
                # Assign random startups as relevant
                relevant_startups = random.sample(
                    list(startup_users),
                    min(random.randint(1, 3), startup_users.count())
                )
                update.relevant_startups.set(relevant_startups)

        # Create deal flow entries
        deal_statuses = ['Initial Contact', 'Due Diligence', 'Negotiation', 'Closed', 'Passed']
        for investor in investor_users:
            num_deals = random.randint(5, 12)
            for _ in range(num_deals):
                first_contact = fake.date_between(start_date='-6m', end_date='today')
                DealFlow.objects.create(
                    investor=investor,
                    startup=random.choice(startup_users),
                    status=random.choice(deal_statuses),
                    first_contact_date=first_contact,
                    last_interaction_date=fake.date_between(start_date=first_contact, end_date='today'),
                    notes=fake.paragraph(),
                    requested_amount=Decimal(str(random.randint(100000, 5000000))),
                    proposed_valuation=Decimal(str(random.randint(1000000, 20000000)))
                )

        # Create milestones
        milestone_types = ['Product', 'Financial', 'Market', 'Team']
        milestone_statuses = ['Planned', 'In Progress', 'Achieved', 'Delayed']
        for startup in startup_users:
            num_milestones = random.randint(4, 8)
            for _ in range(num_milestones):
                status = random.choice(milestone_statuses)
                target_date = fake.date_between(start_date='-3m', end_date='+1y')
                achieved_date = None
                if status == 'Achieved':
                    achieved_date = fake.date_between(start_date='-3m', end_date=target_date)
                
                Milestone.objects.create(
                    startup=startup,
                    title=fake.catch_phrase(),
                    description=fake.paragraph(),
                    target_date=target_date,
                    achieved_date=achieved_date,
                    status=status,
                    type=random.choice(milestone_types),
                    impact_description=fake.paragraph() if status == 'Achieved' else ''
                )

        self.stdout.write(self.style.SUCCESS('Successfully created mock dashboard data'))
