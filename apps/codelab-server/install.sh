#!/bin/bash

# Exit on any error
set -e

# Function to print status messages
print_status() {
    echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    print_status "Loading environment variables from .env file..."
    set -a
    source .env
    set +a
else
    print_status "Warning: .env file not found. Using default environment variables."
fi


# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a service is running
is_service_running() {
    systemctl is-active --quiet "$1"
}

# Step 1: Docker Installation and Setup
print_status "Step 1: Checking Docker installation..."

if ! command_exists docker; then
    print_status "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh ./get-docker.sh
    rm get-docker.sh
else
    print_status "Docker is already installed."
fi

# Add user to docker group if not already added
if ! groups | grep -q docker; then
    print_status "Adding user to docker group..."
    sudo usermod -aG docker $USER
    print_status "Please log out and log back in for group changes to take effect."
fi

# Check and start Docker service
if ! is_service_running docker; then
    print_status "Starting Docker service..."
    sudo systemctl start docker
fi

# Verify Docker is working
if ! docker info >/dev/null 2>&1; then
    print_status "Error: Docker is not running properly. Please check the installation."
    exit 1
fi

print_status "Docker is installed and running."
