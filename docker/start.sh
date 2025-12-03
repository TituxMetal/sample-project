#!/bin/sh

# Create the backups directory if it doesn't exist
mkdir -p /data/backups

# Extract the database file path from DATABASE_URL
DB_FILE=${DATABASE_URL#file:}

# Check if RUN_MIGRATIONS is true
if [ "$RUN_MIGRATIONS" = "yes" ]; then
  # Check if the database file exists
  if [ -f "$DB_FILE" ]; then
    # Backup the database with a timestamp
    BACKUP_FILE="/data/backups/$(basename "$DB_FILE").$(date +%Y%m%d%H%M%S).backup"
    if ! cp "$DB_FILE" "$BACKUP_FILE" 2>/dev/null; then
      echo "Backup failed, proceeding with migration at your own risk"
    fi
  else
    echo "Database file does not exist, skipping backup"
  fi
  # Run migrations
  bun run --filter @app/api prisma migrate deploy
fi

# Start the application
bun run --filter @app/api start:prod
