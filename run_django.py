#!/usr/bin/env python
import os
import sys
import signal
import subprocess

def main():
    """Start Django server as a subprocess"""
    # Change directory to backend
    os.chdir('backend')
    
    # Set environment variables if needed
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'thisisjapan.settings')
    
    # Start the server in a subprocess
    cmd = [sys.executable, 'manage.py', 'runserver', '0.0.0.0:8001']
    print(f"Starting Django server with command: {' '.join(cmd)}")
    
    try:
        # Start server and wait for it
        process = subprocess.Popen(cmd)
        print(f"Django server started with PID {process.pid}")
        # Wait for the process to complete or be interrupted
        process.wait()
    except KeyboardInterrupt:
        # Handle Ctrl+C gracefully
        print("Received keyboard interrupt, shutting down Django server...")
        process.send_signal(signal.SIGINT)
        process.wait()
    except Exception as e:
        print(f"Error running Django server: {e}")
        if 'process' in locals():
            process.kill()
    finally:
        print("Django server shutdown complete")

if __name__ == '__main__':
    main()