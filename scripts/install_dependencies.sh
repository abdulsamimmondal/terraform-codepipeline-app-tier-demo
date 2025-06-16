#!/bin/bash

set -e  # Exit on error
exec > >(tee /tmp/install_dependencies.log) 2>&1  # Log output

echo "[INFO] Installing dependencies..."

# Install NVM (if not already installed)
export NVM_DIR="/home/ec2-user/.nvm"
if [ ! -d "$NVM_DIR" ]; then
  echo "[INFO] Installing NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
fi

# Source NVM
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Install Node.js and PM2
nvm install 16
nvm use 16
npm install -g pm2

# Fix ownership (if needed)
sudo chown -R ec2-user:ec2-user /home/ec2-user/app-tier

# Install app dependencies
cd /home/ec2-user/app-tier
npm install

echo "[INFO] Dependency installation complete."
