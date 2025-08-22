# 🚀 Unified Project Setup Guide

This guide will help you consolidate all virtual environments into ONE and run all services together.

## 🎯 What This Setup Provides

- **ONE Virtual Environment** at the root (`.venv`)
- **Automatic Startup** of Django Backend + FastAPI Recommender
- **Frontend Instructions** for easy setup
- **Unified Dependencies** in a single `requirements.txt`

## 🧹 Step 1: Clean Up Old Virtual Environments

```bash
# Run the cleanup script to remove old virtual environments
./cleanup_virtual_envs.sh
```

This will remove:
- `backend/.venv/`
- `recommender/venv/`
- `recommender/.git/` (separate repo)
- Python cache files

## 🚀 Step 2: Start Everything with One Command

```bash
# Start all services automatically
./start_project.sh
```

This script will:
1. ✅ Create/activate the root `.venv` virtual environment
2. ✅ Install all dependencies from `requirements.txt`
3. ✅ Start Django Backend on port 8000
4. ✅ Start FastAPI Recommender on port 8001
5. ✅ Show frontend setup instructions

## 🌐 Step 3: Start Frontend (in new terminal)

The startup script will show you exactly what to do, but here's the summary:

```bash
# Open a NEW terminal and run:
cd frontend
npm install  # Only needed first time
npm run dev
```

## 📱 Access Your Application

- **Frontend**: http://localhost:3000
- **Django Backend**: http://localhost:8000
- **AI Recommender**: http://localhost:8001
- **Smart Matching**: http://localhost:3000/matching

## 🔧 Manual Startup (Alternative)

If you prefer to start manually:

```bash
# 1. Activate virtual environment
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start Django (in one terminal)
cd backend
python manage.py runserver 0.0.0.0:8000

# 4. Start Recommender (in another terminal)
cd recommender
python start_recommender.py

# 5. Start Frontend (in third terminal)
cd frontend
npm run dev
```

## 🛑 Stopping Services

- **Automatic**: Press `Ctrl+C` in the startup script terminal
- **Manual**: Stop each service with `Ctrl+C` in their respective terminals

## 🔍 Troubleshooting

### Virtual Environment Issues
```bash
# If .venv gets corrupted
rm -rf .venv
./start_project.sh  # Will recreate it
```

### Port Conflicts
- Ensure ports 8000, 8001, and 3000 are available
- Check if other services are using these ports

### Dependencies Issues
```bash
# Reinstall dependencies
source .venv/bin/activate
pip install -r requirements.txt --force-reinstall
```

## 📁 File Structure After Setup

```
project/
├── .venv/                    # 🎯 ONE virtual environment for everything
├── requirements.txt          # 📦 All dependencies in one place
├── start_project.py         # 🚀 Python startup script
├── start_project.sh         # 🐚 Shell startup script
├── cleanup_virtual_envs.sh  # 🧹 Cleanup script
├── backend/                 # Django backend
├── recommender/             # FastAPI AI recommender
├── frontend/                # Next.js frontend
└── ...                      # Other project files
```

## 🎉 Benefits of This Setup

1. **Simplified Management**: One virtual environment to rule them all
2. **Automatic Startup**: Run everything with one command
3. **Unified Dependencies**: All packages in one requirements file
4. **Easy Development**: No more switching between virtual environments
5. **Production Ready**: Easy to deploy and manage

## 🚨 Important Notes

- **Keep the startup script running** to maintain the virtual environment
- **Frontend runs separately** (Node.js doesn't need Python virtual environment)
- **All Python services** (Django + FastAPI) share the same virtual environment
- **Dependencies are automatically managed** and installed

---

**🎯 Goal**: One command to start everything, one virtual environment to manage all Python services!
