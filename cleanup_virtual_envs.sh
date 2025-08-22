#!/bin/bash

# Cleanup Script for Virtual Environments
# This script removes old virtual environments and consolidates to one root .venv

echo "🧹 Cleaning up virtual environments..."
echo "====================================="

# Function to safely remove directory
remove_dir() {
    if [ -d "$1" ]; then
        echo "🗑️  Removing: $1"
        rm -rf "$1"
    else
        echo "ℹ️  Directory not found: $1"
    fi
}

# Remove old virtual environments
echo "🔍 Looking for old virtual environments..."

# Remove backend/.venv
remove_dir "backend/.venv"

# Remove recommender/venv
remove_dir "recommender/venv"

# Remove recommender/.git (if it's a separate git repo)
if [ -d "recommender/.git" ]; then
    echo "🗑️  Removing recommender/.git (separate git repo)"
    rm -rf "recommender/.git"
fi

# Remove recommender/__pycache__
remove_dir "recommender/__pycache__"

# Remove any other Python cache directories
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Run: chmod +x start_project.sh"
echo "2. Run: ./start_project.sh"
echo "3. The script will create a single .venv and install all dependencies"
echo "4. All services (Django + FastAPI + Frontend instructions) will start automatically"
echo ""
echo "🎯 You'll have ONE virtual environment at the root (.venv) that serves all services!"
