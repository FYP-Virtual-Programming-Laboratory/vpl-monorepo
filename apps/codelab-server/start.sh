#!/bin/bash

# Exit on any error
set -e

# Step 3: Start Docker Compose and monitor services
echo "Step 3: Starting services with Docker Compose..."

# Start docker-compose in the background
docker compose up -d

# Function to check if all services are running
check_services() {
    # Check if backend server is reachable
    if ! curl --fail --silent --output /dev/null http://localhost:8000/api/v1/health-check/; then
        echo "Backend server is not reachable. Please check the installation."
        return 1
    fi


    return 0
}

# Monitor services
echo "Monitoring services..."
attempts=0
max_attempts=10  # 10 minutes maximum wait time

while [ $attempts -lt $max_attempts ]; do
    if check_services; then
        echo "All services are running successfully!"
        break
    fi

    attempts=$((attempts + 1))
    if [ $attempts -eq $max_attempts ]; then
        echo "Warning: Some services may not be running properly. Please check manually."
        docker compose ps
        exit 1
    fi

    echo "Waiting for services to start... (Attempt $attempts/$max_attempts)"
    sleep 30
done

echo "Services started successfully!"
