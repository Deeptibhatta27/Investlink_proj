from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('investor', 'Investor'),
        ('startup', 'Startup'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='investor')
    
    # Common profile fields
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Investor-specific fields
    investment_firm = models.CharField(max_length=100, blank=True, null=True)
    investment_range = models.CharField(max_length=50, blank=True, null=True)
    preferred_sectors = models.TextField(blank=True, null=True)
    
    # Startup-specific fields
    
    # Network connections
    connections = models.ManyToManyField('self', symmetrical=False, related_name='connected_by')
    founder_name = models.CharField(max_length=100, blank=True, null=True)
    startup_name = models.CharField(max_length=100, blank=True, null=True)
    industry_sector = models.CharField(max_length=100, blank=True, null=True)
    funding_stage = models.CharField(max_length=50, blank=True, null=True)
    company_description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"
