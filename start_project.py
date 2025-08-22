#!/usr/bin/env python3
"""
Unified Project Startup Script
Runs Django Backend + FastAPI Recommender + Frontend Instructions
"""

import os
import sys
import subprocess
import time
import signal
import threading
from pathlib import Path

class ProjectManager:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.backend_dir = self.project_root / "backend"
        self.recommender_dir = self.project_root / "recommender"
        self.frontend_dir = self.project_root / "frontend"
        
        # Store process references
        self.django_process = None
        self.recommender_process = None
        
        # Setup signal handlers
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)

    def signal_handler(self, signum, frame):
        """Handle shutdown signals gracefully"""
        print(f"\n🛑 Received signal {signum}, shutting down gracefully...")
        self.shutdown()
        sys.exit(0)

    def check_virtual_environment(self):
        """Check if virtual environment is activated"""
        if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
            print("❌ Virtual environment not detected!")
            print("Please activate the virtual environment first:")
            print(f"   source {self.project_root}/.venv/bin/activate")
            return False
        print("✅ Virtual environment is active")
        return True

    def install_dependencies(self):
        """Install all dependencies"""
        print("📦 Installing dependencies...")
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                         check=True, cwd=self.project_root)
            print("✅ Dependencies installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install dependencies: {e}")
            return False

    def start_django_backend(self):
        """Start Django backend server"""
        print("🚀 Starting Django Backend...")
        try:
            # Change to backend directory and start Django
            self.django_process = subprocess.Popen(
                [sys.executable, "manage.py", "runserver", "0.0.0.0:8000"],
                cwd=self.backend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Wait a moment for Django to start
            time.sleep(3)
            
            if self.django_process.poll() is None:
                print("✅ Django Backend started on http://localhost:8000")
                return True
            else:
                stdout, stderr = self.django_process.communicate()
                print(f"❌ Django failed to start: {stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error starting Django: {e}")
            return False

    def start_recommender(self):
        """Start FastAPI recommender server"""
        print("🤖 Starting AI Recommender...")
        try:
            # Start the recommender FastAPI server
            self.recommender_process = subprocess.Popen(
                [sys.executable, "start_recommender.py"],
                cwd=self.recommender_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Wait a moment for recommender to start
            time.sleep(3)
            
            if self.recommender_process.poll() is None:
                print("✅ AI Recommender started on http://localhost:8001")
                return True
            else:
                stdout, stderr = self.recommender_process.communicate()
                print(f"❌ Recommender failed to start: {stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error starting recommender: {e}")
            return False

    def show_frontend_instructions(self):
        """Show instructions for starting the frontend"""
        print("\n" + "="*60)
        print("🌐 FRONTEND SETUP INSTRUCTIONS")
        print("="*60)
        print("The backend services are now running!")
        print("\nTo start the frontend, open a NEW terminal and run:")
        print(f"   cd {self.frontend_dir}")
        print("   npm install  # Only needed first time")
        print("   npm run dev")
        print("\nThen open your browser to: http://localhost:3000")
        print("\n📱 Smart Matching will be available at: http://localhost:3000/matching")
        print("="*60)

    def monitor_services(self):
        """Monitor running services"""
        print("\n🔍 Monitoring services... (Press Ctrl+C to stop)")
        
        while True:
            try:
                # Check Django
                if self.django_process and self.django_process.poll() is not None:
                    print("❌ Django backend has stopped")
                    break
                
                # Check Recommender
                if self.recommender_process and self.recommender_process.poll() is not None:
                    print("❌ AI Recommender has stopped")
                    break
                
                time.sleep(5)
                
            except KeyboardInterrupt:
                break

    def shutdown(self):
        """Shutdown all services gracefully"""
        print("\n🔄 Shutting down services...")
        
        if self.django_process:
            print("   Stopping Django...")
            self.django_process.terminate()
            try:
                self.django_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.django_process.kill()
        
        if self.recommender_process:
            print("   Stopping AI Recommender...")
            self.recommender_process.terminate()
            try:
                self.recommender_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.recommender_process.kill()
        
        print("✅ All services stopped")

    def run(self):
        """Main run method"""
        print("🚀 Starting InvestLink Project...")
        print("="*50)
        
        # Check virtual environment
        if not self.check_virtual_environment():
            return
        
        # Install dependencies
        if not self.install_dependencies():
            return
        
        # Start Django backend
        if not self.start_django_backend():
            return
        
        # Start AI recommender
        if not self.start_recommender():
            return
        
        # Show frontend instructions
        self.show_frontend_instructions()
        
        # Monitor services
        self.monitor_services()

def main():
    """Main entry point"""
    manager = ProjectManager()
    try:
        manager.run()
    except KeyboardInterrupt:
        print("\n🛑 Interrupted by user")
    finally:
        manager.shutdown()

if __name__ == "__main__":
    main()
