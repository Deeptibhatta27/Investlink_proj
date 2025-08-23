#!/bin/bash

# InvestLink Project Startup Script
# This script activates the virtual environment and starts all services



# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Creating new virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Check if activation was successful
if [ $? -eq 0 ]; then
    echo "✅ Virtual environment activated"
else
    echo "❌ Failed to activate virtual environment"
    exit 1
fi

# Start the project
echo "🚀 Starting all services..."
python start_project.py

# Keep the script running to maintain the virtual environment
echo "🔄 Services stopped. Virtual environment still active."
echo "💡 To deactivate, run: deactivate"
