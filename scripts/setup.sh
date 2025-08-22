#!/bin/bash

echo "🚀 Setting up InvestLink project..."

# Update package list
echo "📦 Updating package list..."
sudo apt update

# Install system dependencies
echo "🔧 Installing system dependencies..."
sudo apt install -y python3 python3-pip python3-venv nodejs npm postgresql postgresql-contrib build-essential

# Start PostgreSQL
echo "🗄️ Starting PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
echo "📊 Setting up database..."
sudo -u postgres psql -c "CREATE USER investlink_user WITH PASSWORD '123deepti';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "CREATE DATABASE investlink_db OWNER investlink_user;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE investlink_db TO investlink_user;"

# Create virtual environment
echo "🐍 Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📚 Installing Python dependencies..."
pip install Django==5.2.4
pip install djangorestframework==3.16.0
pip install djangorestframework-simplejwt==5.5.1
pip install psycopg2-binary==2.9.10
pip install django-cors-headers

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Run migrations
echo "🗃️ Running database migrations..."
python3 manage.py makemigrations
python3 manage.py migrate

echo "✅ Setup complete!"
echo ""
echo "🎯 To start the servers:"
echo "1. Terminal 1 (Django): source venv/bin/activate && python3 manage.py runserver"
echo "2. Terminal 2 (Next.js): npm run dev"
echo ""
echo "🌐 Your app will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:8000" 