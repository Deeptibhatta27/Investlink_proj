#!/bin/bash

# Set up environment variables
export PYTHONPATH=/home/sakshamrimal/Investlink_Project/backend
export DJANGO_SETTINGS_MODULE=investlink.settings
export GEMINI_API_KEY=AIzaSyDrFnhgobtJpScfvZJOguj2PiNWGe8tQQA

# Ensure we're in the right directory
cd /home/sakshamrimal/Investlink_Project/backend

# Set up virtual environment if it doesn't exist
python3 -m venv .venv || exit 1
source .venv/bin/activate || exit 1

# Install requirements
pip install -r requirements.txt || exit 1

# Set up database
rm -f db.sqlite3
python3 manage.py makemigrations || exit 1
python3 manage.py migrate || exit 1

# Create test data and run matching test
python3 debug.py 2>&1 | tee debug.log

# Show results
echo -e "\nTest Results:"
echo "=============="
if [ -f debug.log ]; then
    cat debug.log
else
    echo "No debug log was created"
fi
