#!/bin/bash

echo "================================================"
echo "  PASIYA-MD Bot - Clever Cloud Startup"
echo "================================================"

# Create necessary directories
mkdir -p session
mkdir -p public

# Set permissions
chmod -R 755 session
chmod -R 755 public

# Display environment info
echo "Node Version: $(node --version)"
echo "NPM Version: $(npm --version)"
echo "Environment: ${NODE_ENV:-production}"
echo "Port: ${PORT:-8080}"

echo "================================================"
echo "  Starting application..."
echo "================================================"

# Start the application
node index.js
