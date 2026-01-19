#!/bin/bash
set -e

APP_DIR="/home/ubuntu/Personal-Cloud-Drive-Backend-PM2"
PM2_NAME="StorageApp"

# 1. Protection: Save current state
cd "$APP_DIR"
git rev-parse HEAD > .git/LAST_GOOD_COMMIT
CURRENT_HASH=$(cat .git/LAST_GOOD_COMMIT)

rollback() {
    echo "⚠️ Deployment failed. Rolling back to $CURRENT_HASH..."
    cd "$APP_DIR"
    git reset --hard "$CURRENT_HASH"
    
    cd server
    if git diff --name-only HEAD@{1} HEAD | grep -q "package.json"; then
        npm ci --quiet
    fi
    
    /usr/local/nodejs/bin/pm2 reload "$PM2_NAME" || true
    echo "✅ Rollback complete."
    exit 1 
}

trap 'rollback' ERR

# 2. Deployment
echo "Deploying Backend..."
git pull origin main

cd server
if git diff --name-only HEAD~1 HEAD | grep -q "package.json"; then
  echo "Installing dependencies..."
  npm ci
fi

echo "Reloading PM2..."
/usr/local/nodejs/bin/pm2 reload "$PM2_NAME"
sudo systemctl reload nginx

# 3. Cleanup
cd "$APP_DIR"
rm -f .git/LAST_GOOD_COMMIT
echo "✅ Success"
