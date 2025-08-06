#!/bin/bash

# Exit on any error
set -e

# Step 3: Start Docker Compose and monitor services
echo "Step 3: Starting services with Docker Compose..."

# Start docker-compose in the background
docker compose up --build
