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

# Verify Docker is working
if ! command_exists docker; then
    print_status "This application requires docker please ensure you have a working docker installation."
    exit 1
fi

# Step 2: Sysbox Installation and Setup
print_status "Step 2: Checking Sysbox installation..."

if ! command_exists sysbox-runc; then
    print_status "Sysbox not found. Installing Sysbox..."
    # stop docker containers
    docker stop $(docker ps -q)

    # Download and install Sysbox
    wget https://downloads.nestybox.com/sysbox/releases/v0.6.7/sysbox-ce_0.6.7-0.linux_amd64.deb
    sha256sum ./sysbox-ce_0.6.7-0.linux_amd64.deb

    # make the file executable
    chmod +x ./sysbox-ce_0.6.7-0.linux_amd64.deb

    # Install jq a tool required for the installation
    sudo apt-get install jq -y
    sudo apt-get install ./sysbox-ce_0.6.7-0.linux_amd64.deb -y

    rm sysbox-ce_0.6.7-0.linux_amd64.deb
else
    print_status "Sysbox is already installed."
fi


# Check Sysbox services
SYSBOX_SERVICES=("sysbox" "sysbox-mgr" "sysbox-fs")
for service in "${SYSBOX_SERVICES[@]}"; do
    if ! is_service_running "$service"; then
        print_status "Starting $service service..."
        sudo systemctl start "$service"
    fi
done

print_status "Sysbox is installed and running."

RED='\033[0;31m'
NC='\033[0m' 

# Restart docker
if [[ $(grep -iE "Microsoft|WSL" /proc/version) ]]; then
    print_status "${RED}Attention:${NC} Detected WSL environment. You have to restart docker manually."
else
    print_status "Restarting Docker service on the host machine..."
    sudo service docker restart
    print_status "Docker restarted."
fi


# step 3: Install UV and create a virtual environment
if ! command_exists uv; then
    print_status "UV not found. Installing UV..."
    
    curl -LsSf https://astral.sh/uv/install.sh | sh

    uv sync
else 
    uv sync
fi

# Clean up environment variables loaded from .env
if [ -f .env ]; then
    print_status "Cleaning up environment variables..."
    # Get list of variables from .env file
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ $key =~ ^#.*$ ]] && continue
        [[ -z $key ]] && continue
        # Remove the variable
        unset "$key"
    done < .env
fi
