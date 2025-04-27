#!/usr/bin/env python
import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'thisisjapan.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed?"
        ) from exc
    
    # Start the server with specific host and port
    # Use port 8001 to avoid conflict with Express server on 5000
    sys.argv = ['manage.py', 'runserver', '0.0.0.0:8001']
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()