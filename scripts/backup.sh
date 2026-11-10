#!/usr/bin/env bash
set -euo pipefail

# Encrypted database backup for andypratama.studio
# Usage: DATABASE_URL=mysql://user:pass@host:3306/db BACKUP_DIR=./backups GPG_RECIPIENT="owner@example.com" ./scripts/backup.sh

BACKUP_DIR="${BACKUP_DIR:-./backups}"
GPG_RECIPIENT="${GPG_RECIPIENT:-andypratamaworkspace@gmail.com}"
DB_NAME="${DB_NAME:-andypratama_studio}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
DUMP_FILE="${BACKUP_DIR}/${DB_NAME}-${TIMESTAMP}.sql"
ENC_FILE="${DUMP_FILE}.gpg"

mkdir -p "$BACKUP_DIR"

echo "🗄️  Starting database dump for ${DB_NAME}..."

# mysqldump requires DATABASE_URL or MYSQL_PWD + MYSQL_HOST etc.
# Support DATABASE_URL format: mysql://user:pass@host:port/db
if [ -n "${DATABASE_URL:-}" ]; then
  # Parse user, password, host, port, dbname from DATABASE_URL
  DB_URL="${DATABASE_URL#mysql://}"
  AUTH="${DB_URL%%@*}"
  HOSTPORT_DB="${DB_URL#*@}"
  DB_USER="${AUTH%%:*}"
  DB_PASS="${AUTH#*:}"
  DB_HOST="${HOSTPORT_DB%%:*}"
  REST="${HOSTPORT_DB#*:}"
  DB_PORT="${REST%%/*}"
  DB_NAME="${REST#*/}"

  export MYSQL_PWD="$DB_PASS"
  mysqldump -u "$DB_USER" -h "$DB_HOST" -P "$DB_PORT" "$DB_NAME" > "$DUMP_FILE"
else
  echo "❌ DATABASE_URL not set. Set it before running backup."
  exit 1
fi

echo "🔐 Encrypting dump with GPG recipient ${GPG_RECIPIENT}..."
gpg --batch --yes --trust-model always --recipient "$GPG_RECIPIENT" --encrypt "$DUMP_FILE"

echo "🧹 Removing plaintext dump..."
rm -f "$DUMP_FILE"
unset MYSQL_PWD

echo "✅ Backup complete: ${ENC_FILE}"
