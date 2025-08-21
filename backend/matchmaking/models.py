from django.db import models
from accounts.models import User

class StartupProfile(models.Model):
    startup = models.OneToOneField(User, on_delete=models.CASCADE, related_name='startup_profile')
    industry = models.CharField(max_length=100)
    funding_stage = models.CharField(max_length=50)
    target_market = models.CharField(max_length=100)
    revenue = models.DecimalField(max_digits=12, decimal_places=2)
    growth_rate = models.FloatField()
    team_size = models.IntegerField()
    technological_innovation = models.IntegerField()  # 1-10 scale
    market_size = models.DecimalField(max_digits=15, decimal_places=2)
    competition_level = models.IntegerField()  # 1-10 scale
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'matchmaking'
        verbose_name_plural = 'Startup profiles'

    def __str__(self):
        return f"Profile for {self.startup.email}"

class InvestorPreferences(models.Model):
    investor = models.OneToOneField(User, on_delete=models.CASCADE, related_name='investor_preferences')
    preferred_industries = models.JSONField(default=list)
    investment_stage = models.JSONField(default=list)
    min_investment = models.DecimalField(max_digits=12, decimal_places=2)
    max_investment = models.DecimalField(max_digits=12, decimal_places=2)
    target_markets = models.JSONField(default=list)
    risk_appetite = models.IntegerField(default=5)  # 1-10 scale
    expected_return = models.FloatField()
    investment_timeline = models.IntegerField()  # in months
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'matchmaking'
        verbose_name_plural = 'Investor preferences'

    def __str__(self):
        return f"Preferences for {self.investor.email}"

class AIMatch(models.Model):
    investor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_investor_matches')
    startup = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_startup_matches')
    compatibility_score = models.FloatField()
    ai_analysis = models.TextField(null=True, blank=True)
    match_explanation = models.TextField(null=True, blank=True)
    suggestion_type = models.CharField(max_length=50)  # direct, emerging, diversification
    confidence_score = models.FloatField()
    factor_breakdown = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'matchmaking'
        unique_together = ('investor', 'startup')
        verbose_name_plural = 'AI Matches'

    def __str__(self):
        return f"Match: {self.investor.email} -> {self.startup.email} ({self.compatibility_score:.1f}%)"
