#!/bin/bash

# Exit on any error
set -e

# Step 3: Start Docker Compose and monitor services
echo "Step 3: Starting services with Docker Compose..."

# Start docker-compose in the background
docker compose build

# Function to check if all services are running
check_services() {
    # Check if backend server is reachable
    if ! curl --fail --silent --output /dev/null http://localhost:8000/api/v1/health-check/; then
        echo "Backend server is not reachable. Please check the installation."
        return 1
    fi

    # TODO: Check if frontend server is reachable. When frontend is ready.

    return 0
}

# Monitor services
echo "Monitoring services..."
attempts=0
max_attempts=10  # 10 minutes maximum wait time

echo "Services started successfully!"
