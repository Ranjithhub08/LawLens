import sys
import os

# Add backend directory to sys.path for absolute imports to resolve natively
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app

# Vercel's Python runtime expects a module-level variable to interface with.
app = app
