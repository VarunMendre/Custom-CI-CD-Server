#!/bin/bash
set -e

PROJECT_DIR="/home/ubuntu/Personal-Cloud-Drive-Frontend"
DIST_DIR="$PROJECT_DIR/dist"
S3_BUCKET=""
CF_DIST_ID=""

cd "$PROJECT_DIR"

if [ "$(git branch --show-current)" != "main" ]; then
  echo "❌ Error: Not on main branch"
  exit 1
fi

PREV_COMMIT=$(git rev-parse HEAD)

rollback() {
    echo "⚠️ Deployment failed. Rolling back to $PREV_COMMIT..."
    git reset --hard "$PREV_COMMIT"
    npm ci
    npm run build
    
    if [ -n "$S3_BUCKET" ]; then
        aws s3 sync "$DIST_DIR" "$S3_BUCKET" --delete
    fi
    if [ -n "$CF_DIST_ID" ]; then
        aws cloudfront create-invalidation --distribution-id "$CF_DIST_ID" --paths "//index.html"
    fi
    
    echo "✅ Rollback complete."
    exit 1
}

trap 'rollback' ERR

# Deployment Logic
echo "Deploying Frontend..."
git fetch origin
git reset --hard origin/main

NEW_COMMIT=$(git rev-parse HEAD)

if git diff --name-only "$PREV_COMMIT" "$NEW_COMMIT" | grep -q "package-lock.json"; then
  echo "Installing dependencies..."
  npm ci
fi

echo "Building..."
npm run build

if [ -n "$S3_BUCKET" ]; then
    echo "Syncing to S3..."
    aws s3 sync "$DIST_DIR" "$S3_BUCKET" --delete
fi

if [ -n "$CF_DIST_ID" ]; then
    echo "Invalidating CloudFront..."
    aws cloudfront create-invalidation --distribution-id "$CF_DIST_ID" --paths "//index.html"
fi

echo "✅ Success"
