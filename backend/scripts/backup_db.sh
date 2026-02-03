#!/bin/bash

# Database Backup Script
# Usage: ./backup_db.sh [output_dir]

# Load environment variables
if [ -f ../.env ]; then
  export $(cat ../.env | grep -v '#' | awk '/=/ {print $1}')
fi

# Configuration
BACKUP_DIR=${1:-"../backups"}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="raffle_db_backup_${TIMESTAMP}.sql"
LOG_FILE="${BACKUP_DIR}/backup_log.txt"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup of database: ${DATABASE_NAME}" | tee -a "$LOG_FILE"

# Create backup
if PGPASSWORD=$DATABASE_PASSWORD pg_dump -h $DATABASE_HOST -U $DATABASE_USER -p $DATABASE_PORT $DATABASE_NAME > "${BACKUP_DIR}/${FILENAME}"; then
  echo "[$(date)] Backup completed successfully: ${FILENAME}" | tee -a "$LOG_FILE"
  
  # Compress backup
  gzip "${BACKUP_DIR}/${FILENAME}"
  echo "[$(date)] Backup compressed: ${FILENAME}.gz" | tee -a "$LOG_FILE"
  
  # Keep only last 7 days of backups
  find "$BACKUP_DIR" -name "raffle_db_backup_*.sql.gz" -mtime +7 -delete
  echo "[$(date)] Old backups cleaned up" | tee -a "$LOG_FILE"
else
  echo "[$(date)] Backup FAILED!" | tee -a "$LOG_FILE"
  exit 1
fi
