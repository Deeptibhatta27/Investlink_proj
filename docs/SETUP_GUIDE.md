# 🚀 InvestLink Project Setup Guide

This guide will help you set up the InvestLink project on any device.

## 📋 Prerequisites

- **Operating System**: Linux, macOS, or Windows
- **Git**: For cloning the repository
- **Internet Connection**: For downloading dependencies

## 🛠️ Quick Setup (Linux/Ubuntu)

### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/SakshamRimal/Invest.git
cd Invest

# Run the automated setup script
./setup.sh
```

### Option 2: Manual Setup

#### 1. Install System Dependencies
```bash
# Update package list
sudo apt update

# Install required packages
sudo apt install -y python3 python3-pip python3-venv nodejs npm postgresql postgresql-contrib build-essential
```

#### 2. Set Up PostgreSQL
```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE USER investlink_user WITH PASSWORD '123deepti';"
sudo -u postgres psql -c "CREATE DATABASE investlink_db OWNER investlink_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE investlink_db TO investlink_user;"
```

#### 3. Set Up Python Environment
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

#### 4. Set Up Node.js Dependencies
```bash
# Install npm packages
npm install
```

#### 5. Run Database Migrations
```bash
# Make sure virtual environment is activated
python3 manage.py makemigrations
python3 manage.py migrate
```

## 🍎 macOS Setup

### Install Dependencies
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install required packages
brew install python3 node postgresql

# Start PostgreSQL
brew services start postgresql
```

### Follow the same steps as Linux (steps 2-5 above)

## 🪟 Windows Setup

### Install Dependencies
1. **Python**: Download and install from [python.org](https://python.org)
2. **Node.js**: Download and install from [nodejs.org](https://nodejs.org)
3. **PostgreSQL**: Download and install from [postgresql.org](https://postgresql.org)

### Set Up Database
```bash
# Open Command Prompt as Administrator
# Navigate to PostgreSQL bin directory (adjust path as needed)
cd "C:\Program Files\PostgreSQL\[version]\bin"

# Create database and user
psql -U postgres -c "CREATE USER investlink_user WITH PASSWORD '123deepti';"
psql -U postgres -c "CREATE DATABASE investlink_db OWNER investlink_user;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE investlink_db TO investlink_user;"
```

### Set Up Python Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### Follow the same steps as Linux (steps 4-5 above)

## 🚀 Running the Application

### Start Django Backend
```bash
# Terminal 1
source venv/bin/activate  # Linux/macOS
# or venv\Scripts\activate  # Windows

python3 manage.py runserver
```

### Start Next.js Frontend
```bash
# Terminal 2
npm run dev
```

## 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin

## 🔧 Troubleshooting

### Common Issues

#### 1. PostgreSQL Connection Error
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL if needed
sudo systemctl restart postgresql
```

#### 2. Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :8000  # For Django
sudo lsof -i :3000  # For Next.js

# Kill the process if needed
sudo kill -9 [PID]
```

#### 3. Permission Denied
```bash
# Make setup script executable
chmod +x setup.sh
```

#### 4. Node.js Version Issues
```bash
# Update Node.js to latest LTS version
# Visit https://nodejs.org for download
```

## 📁 Project Structure

```
Invest/
├── accounts/          # Django user management app
├── app/              # Next.js frontend
├── investlink/       # Django project settings
├── manage.py         # Django management script
├── requirements.txt  # Python dependencies
├── package.json      # Node.js dependencies
├── setup.sh          # Automated setup script
└── SETUP_GUIDE.md    # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues during setup, please:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed error information

---

**Happy Coding! 🎉** 