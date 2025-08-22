from django.db import models
from django.conf import settings

class Investment(models.Model):
    investor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='investments')
    company_name = models.CharField(max_length=200)
    company_sector = models.CharField(max_length=100)
    investment_stage = models.CharField(max_length=50)
    risk_level = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    invested_date = models.DateField()
    initial_investment = models.DecimalField(max_digits=15, decimal_places=2)
    current_value = models.DecimalField(max_digits=15, decimal_places=2)
    ownership_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    roi_percentage = models.DecimalField(max_digits=7, decimal_places=2)
    last_round = models.CharField(max_length=50)
    next_milestone = models.CharField(max_length=200)
    performance_status = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def gain_loss(self):
        difference = self.current_value - self.initial_investment
        return f"{'Gain' if difference >= 0 else 'Loss'}: ${abs(difference):,.2f}"

    class Meta:
        ordering = ['-invested_date']

class StartupMetrics(models.Model):
    startup = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='metrics')
    revenue = models.DecimalField(max_digits=15, decimal_places=2)
    burn_rate = models.DecimalField(max_digits=15, decimal_places=2)
    runway_months = models.IntegerField()
    team_size = models.IntegerField()
    customer_count = models.IntegerField()
    churn_rate = models.DecimalField(max_digits=5, decimal_places=2)
    growth_rate = models.DecimalField(max_digits=6, decimal_places=2)
    market_size = models.DecimalField(max_digits=15, decimal_places=2)
    last_funding_date = models.DateField()
    last_funding_amount = models.DecimalField(max_digits=15, decimal_places=2)
    current_valuation = models.DecimalField(max_digits=15, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Startup metrics"

class MarketUpdate(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    sector = models.CharField(max_length=100)
    impact_level = models.CharField(max_length=50)  # High, Medium, Low
    relevant_startups = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='relevant_market_updates'
    )
    published_date = models.DateTimeField(auto_now_add=True)
    source_url = models.URLField(blank=True)

    class Meta:
        ordering = ['-published_date']

class DealFlow(models.Model):
    investor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='deal_flow'
    )
    startup = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='investor_deals'
    )
    status = models.CharField(max_length=50)  # Initial Contact, Due Diligence, Negotiation, Closed, Passed
    first_contact_date = models.DateField()
    last_interaction_date = models.DateField()
    notes = models.TextField(blank=True)
    requested_amount = models.DecimalField(max_digits=15, decimal_places=2)
    proposed_valuation = models.DecimalField(max_digits=15, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_interaction_date']

class Milestone(models.Model):
    startup = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='milestones'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    target_date = models.DateField()
    achieved_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50)  # Planned, In Progress, Achieved, Delayed
    type = models.CharField(max_length=50)  # Product, Financial, Market, Team
    impact_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['target_date']
