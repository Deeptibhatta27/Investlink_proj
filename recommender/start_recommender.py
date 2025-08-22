#!/usr/bin/env python3
"""
Startup script for the AI Recommender FastAPI server
Optimized for unified project management
"""

import uvicorn
import os
import sys
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    # Add the current directory to Python path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.append(current_dir)
    
    # Configuration
    host = "0.0.0.0"
    port = 8001
    reload = True
    
    print(f"🚀 Starting AI Recommender FastAPI server...")
    print(f"📍 Server will be available at: http://{host}:{port}")
    print(f"🔗 API Documentation: http://{host}:{port}/docs")
    print(f"📊 Health Check: http://{host}:{port}/")
    print(f"🔄 Auto-reload: {'Enabled' if reload else 'Disabled'}")
    print(f"⏹️  Press Ctrl+C to stop the server")
    print("-" * 60)
    
    try:
        # Check if models exist
        required_files = [
            'compatibility_model.joblib',
            'traction_model.joblib', 
            'industry_model.joblib',
            'thesis_vectorizer.joblib',
            'description_vectorizer.joblib'
        ]
        
        missing_files = []
        for file in required_files:
            if not os.path.exists(file):
                missing_files.append(file)
        
        if missing_files:
            logger.error(f"Missing required model files: {missing_files}")
            print(f"❌ Error: Missing required model files: {missing_files}")
            print("Please ensure all model files are present in the recommender directory.")
            sys.exit(1)
        
        logger.info("All required model files found. Starting server...")
        
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=reload,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"Error starting server: {e}")
        print(f"❌ Error starting server: {e}")
        sys.exit(1)
