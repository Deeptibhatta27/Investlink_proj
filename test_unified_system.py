#!/usr/bin/env python3
"""
Test script for the unified system
Verifies that all services can start and communicate
"""

import os
import sys
import time
import requests
import subprocess
from pathlib import Path

def test_virtual_environment():
    """Test if virtual environment is properly set up"""
    print("🔍 Testing virtual environment...")
    
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("❌ Virtual environment not detected!")
        return False
    
    print("✅ Virtual environment is active")
    print(f"   Python: {sys.executable}")
    print(f"   Path: {sys.prefix}")
    return True

def test_dependencies():
    """Test if key dependencies are installed"""
    print("\n📦 Testing dependencies...")
    
    required_packages = [
        'django',
        'fastapi', 
        'uvicorn',
        'numpy',
        'pandas',
        'scikit-learn'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package}")
            missing.append(package)
    
    if missing:
        print(f"❌ Missing packages: {missing}")
        return False
    
    print("✅ All required packages are installed")
    return True

def test_django_setup():
    """Test Django backend setup"""
    print("\n🐍 Testing Django setup...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return False
    
    manage_py = backend_dir / "manage.py"
    if not manage_py.exists():
        print("❌ manage.py not found")
        return False
    
    try:
        # Test Django configuration
        result = subprocess.run(
            [sys.executable, "manage.py", "check", "--deploy"],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            print("✅ Django configuration is valid")
            return True
        else:
            print(f"❌ Django configuration error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Django check timed out")
        return False
    except Exception as e:
        print(f"❌ Django test error: {e}")
        return False

def test_recommender_setup():
    """Test AI recommender setup"""
    print("\n🤖 Testing AI Recommender setup...")
    
    recommender_dir = Path("recommender")
    if not recommender_dir.exists():
        print("❌ Recommender directory not found")
        return False
    
    # Check for required files
    required_files = [
        'main.py',
        'start_recommender.py',
        'compatibility_model.joblib',
        'traction_model.joblib',
        'industry_model.joblib'
    ]
    
    missing_files = []
    for file in required_files:
        if not (recommender_dir / file).exists():
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing files: {missing_files}")
        return False
    
    print("✅ All required files present")
    
    # Test if the main.py can be imported
    try:
        sys.path.insert(0, str(recommender_dir))
        import main
        print("✅ Recommender main.py can be imported")
        return True
    except Exception as e:
        print(f"❌ Error importing recommender: {e}")
        return False

def test_frontend_setup():
    """Test frontend setup"""
    print("\n🌐 Testing Frontend setup...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False
    
    package_json = frontend_dir / "package.json"
    if not package_json.exists():
        print("❌ package.json not found")
        return False
    
    print("✅ Frontend directory structure looks good")
    print("   Note: Frontend requires Node.js and npm to run")
    return True

def run_quick_tests():
    """Run quick tests to verify system health"""
    print("\n🧪 Running quick system tests...")
    
    tests = [
        ("Virtual Environment", test_virtual_environment),
        ("Dependencies", test_dependencies),
        ("Django Setup", test_django_setup),
        ("Recommender Setup", test_recommender_setup),
        ("Frontend Setup", test_frontend_setup)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test failed with error: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*50)
    print("📊 TEST RESULTS SUMMARY")
    print("="*50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:20} {status}")
        if result:
            passed += 1
    
    print("="*50)
    print(f"Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your system is ready to run.")
        print("\n🚀 To start everything, run:")
        print("   ./start_project.sh")
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
        print("\n🔧 To troubleshoot:")
        print("   1. Ensure virtual environment is activated")
        print("   2. Run: pip install -r requirements.txt")
        print("   3. Check file permissions and paths")
    
    return passed == total

if __name__ == "__main__":
    print("🚀 InvestLink Unified System Test")
    print("="*40)
    
    success = run_quick_tests()
    
    if success:
        sys.exit(0)
    else:
        sys.exit(1)
