from django.contrib import admin
from .models import Investment, StartupMetrics, MarketUpdate, DealFlow, Milestone

@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'investor', 'investment_stage', 'status', 'invested_date', 'initial_investment', 'current_value', 'roi_percentage')
    list_filter = ('investment_stage', 'status', 'risk_level', 'company_sector')
    search_fields = ('company_name', 'investor__username', 'investor__email')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(StartupMetrics)
class StartupMetricsAdmin(admin.ModelAdmin):
    list_display = ('startup', 'revenue', 'burn_rate', 'runway_months', 'team_size', 'customer_count', 'growth_rate')
    list_filter = ('runway_months', 'team_size')
    search_fields = ('startup__username', 'startup__email')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(MarketUpdate)
class MarketUpdateAdmin(admin.ModelAdmin):
    list_display = ('title', 'sector', 'impact_level', 'published_date')
    list_filter = ('sector', 'impact_level', 'published_date')
    search_fields = ('title', 'content', 'sector')
    filter_horizontal = ('relevant_startups',)

@admin.register(DealFlow)
class DealFlowAdmin(admin.ModelAdmin):
    list_display = ('investor', 'startup', 'status', 'first_contact_date', 'last_interaction_date', 'requested_amount')
    list_filter = ('status', 'first_contact_date', 'last_interaction_date')
    search_fields = ('investor__username', 'startup__username', 'notes')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ('startup', 'title', 'type', 'target_date', 'status', 'achieved_date')
    list_filter = ('status', 'type', 'target_date', 'achieved_date')
    search_fields = ('title', 'description', 'startup__username')
    readonly_fields = ('created_at', 'updated_at')
