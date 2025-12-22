#!/bin/sh
set -e

echo "============================================"
echo "Medusa Backend - Starting (${ENV_NAME:-unknown})..."
echo "============================================"

# Wait for database to be ready (extra safety)
echo "Waiting for database connection..."
sleep 3

# Run database migrations
echo "Running database migrations..."
npx medusa db:migrate

# Run seed if enabled (only on first run)
if [ "$RUN_SEED" = "true" ]; then
    echo "Seeding database..."
    npm run seed || echo "Seeding skipped or already done"
fi

# Start Medusa
echo "Starting Medusa server (${ENV_NAME:-unknown})..."
echo "============================================"
npx medusa start
