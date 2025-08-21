from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Avg
from django.utils.timezone import now
from dateutil.relativedelta import relativedelta
from .models import Investment, StartupMetrics, MarketUpdate, DealFlow, Milestone
from .serializers import (
    InvestmentSerializer,
    StartupMetricsSerializer,
    MarketUpdateSerializer,
    DealFlowSerializer,
    MilestoneSerializer
)

class InvestmentViewSet(viewsets.ModelViewSet):
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'investor':
            return Investment.objects.filter(investor=self.request.user)
        return Investment.objects.none()

    @action(detail=False, methods=['get'])
    def portfolio_summary(self, request):
        investments = self.get_queryset()
        total_invested = investments.aggregate(Sum('initial_investment'))['initial_investment__sum'] or 0
        total_current = investments.aggregate(Sum('current_value'))['current_value__sum'] or 0
        avg_roi = investments.aggregate(Avg('roi_percentage'))['roi_percentage__avg'] or 0

        return Response({
            'total_invested': total_invested,
            'total_current_value': total_current,
            'total_return': total_current - total_invested,
            'average_roi': avg_roi,
            'number_of_investments': investments.count()
        })

class StartupMetricsViewSet(viewsets.ModelViewSet):
    serializer_class = StartupMetricsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'startup':
            return StartupMetrics.objects.filter(startup=self.request.user)
        elif self.request.user.role == 'investor':
            # Investors can see metrics of startups they've invested in
            invested_startups = Investment.objects.filter(
                investor=self.request.user
            ).values_list('startup', flat=True)
            return StartupMetrics.objects.filter(startup__in=invested_startups)
        return StartupMetrics.objects.none()

    @action(detail=False, methods=['get'])
    def growth_trends(self, request):
        metrics = self.get_queryset().first()
        if not metrics:
            return Response({})

        six_months_ago = now().date() - relativedelta(months=6)
        
        # In a real app, you'd have historical data. Here we'll simulate it
        revenue_trend = [
            metrics.revenue * (1 - (i * 0.1))  # Simulated 10% monthly growth backwards
            for i in range(6)
        ]
        customer_trend = [
            metrics.customer_count * (1 - (i * 0.08))  # Simulated 8% monthly growth backwards
            for i in range(6)
        ]

        return Response({
            'revenue_trend': revenue_trend[::-1],  # Reverse to show oldest to newest
            'customer_trend': customer_trend[::-1],
            'months': [
                (six_months_ago + relativedelta(months=i)).strftime('%B')
                for i in range(6)
            ]
        })

class MarketUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = MarketUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'startup':
            return MarketUpdate.objects.filter(relevant_startups=self.request.user)
        return MarketUpdate.objects.all()

    @action(detail=False, methods=['get'])
    def recent_high_impact(self, request):
        return Response(
            self.get_serializer(
                self.get_queryset().filter(impact_level='High').order_by('-published_date')[:5],
                many=True
            ).data
        )

class DealFlowViewSet(viewsets.ModelViewSet):
    serializer_class = DealFlowSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'investor':
            return DealFlow.objects.filter(investor=self.request.user)
        elif self.request.user.role == 'startup':
            return DealFlow.objects.filter(startup=self.request.user)
        return DealFlow.objects.none()

    @action(detail=False, methods=['get'])
    def pipeline_summary(self, request):
        deals = self.get_queryset()
        return Response({
            'total_deals': deals.count(),
            'status_breakdown': {
                status: deals.filter(status=status).count()
                for status in ['Initial Contact', 'Due Diligence', 'Negotiation', 'Closed', 'Passed']
            },
            'total_potential_value': sum(
                deal.requested_amount
                for deal in deals.filter(status__in=['Due Diligence', 'Negotiation'])
            )
        })

class MilestoneViewSet(viewsets.ModelViewSet):
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'startup':
            return Milestone.objects.filter(startup=self.request.user)
        elif self.request.user.role == 'investor':
            # Investors can see milestones of startups they've invested in
            invested_startups = Investment.objects.filter(
                investor=self.request.user
            ).values_list('startup', flat=True)
            return Milestone.objects.filter(startup__in=invested_startups)
        return Milestone.objects.none()

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        today = now().date()
        upcoming = self.get_queryset().filter(
            target_date__gte=today,
            status__in=['Planned', 'In Progress']
        ).order_by('target_date')[:5]
        return Response(self.get_serializer(upcoming, many=True).data)
