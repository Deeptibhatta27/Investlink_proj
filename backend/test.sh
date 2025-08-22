#!/bin/bash
set -x  # Enable command tracing
set -e  # Exit on error

echo "Starting setup..."

# Create virtual environment
python3 -m venv .venv
. .venv/bin/activate

# Install Django
pip install django

echo "Testing Django installation..."
python3 -c "import django; print('Django version:', django.get_version())"

# Set environment variables
export PYTHONPATH=/home/sakshamrimal/Investlink_Project/backend
export DJANGO_SETTINGS_MODULE=investlink.settings

echo "Attempting Django database setup..."
python3 manage.py check

echo "Setup complete"
