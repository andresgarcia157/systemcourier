#!/bin/bash

# Stop on error
set -e

# Load environment variables
source .env.production

# Build the application
echo "Building application..."
npm run build

# Create necessary directories
echo "Creating directories..."
mkdir -p /var/www/cargo-express
mkdir -p /var/www/cargo-express/public
mkdir -p /var/www/cargo-express/uploads

# Copy files
echo "Copying files..."
cp -r .next/standalone/* /var/www/cargo-express/
cp -r public/* /var/www/cargo-express/public/
cp -r .next/static /var/www/cargo-express/.next/
cp .env.production /var/www/cargo-express/.env

# Set permissions
echo "Setting permissions..."
chown -R www-data:www-data /var/www/cargo-express
chmod -R 755 /var/www/cargo-express

# Restart services
echo "Restarting services..."
systemctl restart cargo-express
systemctl restart nginx

echo "Deployment completed successfully!"

