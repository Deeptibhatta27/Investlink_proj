from rest_framework import serializers
from .models import Investment, StartupMetrics, MarketUpdate, DealFlow, Milestone

class InvestmentSerializer(serializers.ModelSerializer):
    gain_loss = serializers.CharField(read_only=True)
    roi_display = serializers.SerializerMethodField()

    class Meta:
        model = Investment
        fields = '__all__'

    def get_roi_display(self, obj):
        return f"{obj.roi_percentage:+.1f}%"

class StartupMetricsSerializer(serializers.ModelSerializer):
    runway_display = serializers.SerializerMethodField()
    growth_display = serializers.SerializerMethodField()

    class Meta:
        model = StartupMetrics
        fields = '__all__'

    def get_runway_display(self, obj):
        years = obj.runway_months // 12
        months = obj.runway_months % 12
        if years > 0:
            return f"{years}y {months}m"
        return f"{months}m"

    def get_growth_display(self, obj):
        return f"{obj.growth_rate:+.1f}%"

class MarketUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketUpdate
        fields = '__all__'

class DealFlowSerializer(serializers.ModelSerializer):
    startup_name = serializers.CharField(source='startup.company', read_only=True)
    investor_name = serializers.CharField(source='investor.name', read_only=True)
    days_since_last_interaction = serializers.SerializerMethodField()

    class Meta:
        model = DealFlow
        fields = '__all__'

    def get_days_since_last_interaction(self, obj):
        from django.utils.timezone import now
        from datetime import datetime
        today = now().date()
        return (today - obj.last_interaction_date).days

class MilestoneSerializer(serializers.ModelSerializer):
    days_until_target = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Milestone
        fields = '__all__'

    def get_days_until_target(self, obj):
        from django.utils.timezone import now
        today = now().date()
        return (obj.target_date - today).days

    def get_progress_percentage(self, obj):
        if obj.status == 'Achieved':
            return 100
        elif obj.status == 'Delayed':
            return 70
        elif obj.status == 'In Progress':
            from django.utils.timezone import now
            today = now().date()
            total_days = (obj.target_date - obj.created_at.date()).days
            days_passed = (today - obj.created_at.date()).days
            if total_days > 0:
                return min(int((days_passed / total_days) * 100), 99)
            return 50
        return 0
