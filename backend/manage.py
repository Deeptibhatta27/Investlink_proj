#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

# Ensure repository root is on PYTHONPATH so top-level apps (matchmaking, etc.) can be imported
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))


def main():
    """Run administrative tasks."""
    print("Initializing Django...")
    print(f"Current directory: {os.getcwd()}")
    print(f"PYTHONPATH: {sys.path}")
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investlink.settings')
    print(f"Django settings module: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    
    try:
        print("Importing Django...")
        import django
        print(f"Django version: {django.get_version()}")
        from django.core.management import execute_from_command_line
        print("Successfully imported Django")
    except ImportError as exc:
        print("Failed to import Django!")
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    print(f"Executing command: {sys.argv}")
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
