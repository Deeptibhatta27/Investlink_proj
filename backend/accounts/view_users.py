#!/usr/bin/env python3
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investlink.settings')
django.setup()

from accounts.models import User

def view_users():
    print("=" * 80)
    print("📊 REGISTERED USERS IN INVESTLINK")
    print("=" * 80)
    
    users = User.objects.all().order_by('-date_joined')
    
    if not users:
        print("❌ No users found in the database.")
        return
    
    print(f"{'ID':<5} {'Username':<20} {'Email':<30} {'Role':<15} {'Date Joined':<20}")
    print("-" * 80)
    
    for user in users:
        print(f"{user.id:<5} {user.username:<20} {user.email:<30} {user.role:<15} {user.date_joined.strftime('%Y-%m-%d %H:%M'):<20}")
    
    print("-" * 80)
    print(f"Total users: {users.count()}")
    print("=" * 80)

if __name__ == "__main__":
    view_users() 